'use client'

import { CanvasActions } from '@/components/canvas/CanvasActions'
import { CanvasTools } from '@/components/canvas/CanvasTools'
import { ColorPicker } from '@/components/canvas/ColorPicker'
import { EraserSizePicker } from '@/components/canvas/EraserSizePicker'
import { LineWidthPicker } from '@/components/canvas/LineWidthPicker'
import { useCanvas } from '@/hooks/useCanvas'
import { useDrawingTools } from '@/hooks/useDrawingTools'
import { transparentForm } from '@/styles/form'
import { useCallback, useEffect, useRef } from 'react'

// floodFill 함수 구현
const floodFill = (
  imageData: ImageData,
  startX: number,
  startY: number,
  fillColor: string,
  width: number,
  height: number,
) => {
  const pixels = imageData.data
  const startPos = (startY * width + startX) * 4
  const startR = pixels[startPos]
  const startG = pixels[startPos + 1]
  const startB = pixels[startPos + 2]
  const startA = pixels[startPos + 3]

  // fillColor를 RGB로 변환
  const fillColorRGB = hexToRgb(fillColor)
  if (!fillColorRGB) return

  const stack: [number, number][] = [[startX, startY]]
  const visited = new Set<string>()

  while (stack.length > 0) {
    const popped = stack.pop()
    if (!popped) continue
    const [x, y] = popped
    const pos = (y * width + x) * 4

    if (
      x < 0 ||
      x >= width ||
      y < 0 ||
      y >= height ||
      visited.has(`${x},${y}`) ||
      pixels[pos] !== startR ||
      pixels[pos + 1] !== startG ||
      pixels[pos + 2] !== startB ||
      pixels[pos + 3] !== startA
    ) {
      continue
    }

    visited.add(`${x},${y}`)
    pixels[pos] = fillColorRGB.r
    pixels[pos + 1] = fillColorRGB.g
    pixels[pos + 2] = fillColorRGB.b
    pixels[pos + 3] = 255

    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
  }
}

// hex 색상을 RGB로 변환하는 함수
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

interface PaintingCanvasProps {
  canvasRef?: React.RefObject<HTMLCanvasElement | null>
  initialImage?: string
}

const PaintingCanvas: React.FC<PaintingCanvasProps> = ({
  canvasRef: externalCanvasRef,
  initialImage,
}) => {
  const internalCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasRefToUse = externalCanvasRef || internalCanvasRef
  const containerRef = useRef<HTMLDivElement>(null)

  // 색상 옵션
  const colorOptions = ['#000000', '#FF0000', '#0000FF', '#008000', '#800080', '#FFA500']
  // 선 굵기 옵션
  const lineWidthOptions = [1, 2, 4, 6]
  // 지우개 크기 옵션
  const eraserSizeOptions = [10, 20, 30, 40]

  const {
    canvasWidth,
    canvasHeight,
    currentHistoryIndex,
    historyRef,
    undo,
    redo,
    clearCanvas,
    saveCanvas,
    saveToHistory,
  } = useCanvas({ canvasRef: canvasRefToUse, initialImage })

  const {
    strokeColor,
    lineWidth,
    activeTool,
    eraseSize,
    eraserCursorRef,
    setStrokeColor,
    setLineWidth,
    setActiveTool,
    setEraseSize,
    startDrawing,
    draw,
    stopDrawing,
  } = useDrawingTools({ canvasRef: canvasRefToUse, saveToHistory })

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z (Undo)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }

      // Ctrl+Shift+Z or Ctrl+Y (Redo)
      if (
        (e.ctrlKey || e.metaKey) &&
        ((e.key.toLowerCase() === 'z' && e.shiftKey) || e.key.toLowerCase() === 'y')
      ) {
        e.preventDefault()
        redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

  const handleColorChange = useCallback(
    (color: string) => {
      setStrokeColor(color)
    },
    [setStrokeColor],
  )

  const handleLineWidthChange = useCallback(
    (width: number) => {
      setLineWidth(width)
      setActiveTool('pen')
    },
    [setLineWidth, setActiveTool],
  )

  const handleToolChange = useCallback(
    (tool: 'pen' | 'eraser' | 'fill') => {
      setActiveTool(tool)
    },
    [setActiveTool],
  )

  const handleEraserSizeChange = useCallback(
    (size: number) => {
      setEraseSize(size)
    },
    [setEraseSize],
  )

  // 캔버스 크기 조정 및 내용 유지를 위한 useEffect
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      const canvas = canvasRefToUse.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // 현재 캔버스 내용 저장
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      // 캔버스 크기 조정
      canvas.width = canvasWidth
      canvas.height = canvasHeight

      // 저장된 내용 복원
      ctx.putImageData(imageData, 0, 0)
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [canvasWidth, canvasHeight, canvasRefToUse])

  return (
    <div className="mt-4 flex flex-col gap-2">
      <span className="text-sm">캐릭터 그림</span>
      <div ref={containerRef} className={`w-full rounded-xl p-4 ${transparentForm}`}>
        <div className="relative" style={{ touchAction: 'none', zIndex: 0 }}>
          <canvas
            ref={canvasRefToUse}
            className="bg-white rounded-xl touch-none"
            style={{
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
              touchAction: 'none',
              position: 'relative',
              zIndex: 0,
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onClick={(e) => {
              if (activeTool === 'fill') {
                const canvas = canvasRefToUse.current
                if (!canvas) return

                const ctx = canvas.getContext('2d')
                if (!ctx) return

                const rect = canvas.getBoundingClientRect()
                const scaleX = canvas.width / rect.width
                const scaleY = canvas.height / rect.height
                const x = (e.clientX - rect.left) * scaleX
                const y = (e.clientY - rect.top) * scaleY

                // 현재 클릭한 위치의 픽셀 데이터 가져오기
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

                // flood fill 알고리즘 실행
                floodFill(
                  imageData,
                  Math.floor(x),
                  Math.floor(y),
                  strokeColor,
                  canvas.width,
                  canvas.height,
                )

                // 변경된 이미지 데이터를 캔버스에 적용
                ctx.putImageData(imageData, 0, 0)
                saveToHistory()
              }
            }}
            aria-label="그림 캔버스"
          />
          <div
            ref={eraserCursorRef}
            className="absolute rounded-full border-2 border-gray-500 bg-white opacity-50 pointer-events-none"
            style={{
              display: 'none',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
            }}
          />
        </div>

        <CanvasTools activeTool={activeTool} onToolChange={handleToolChange} />

        <div className="flex justify-between flex-wrap gap-x-4">
          {(activeTool === 'pen' || activeTool === 'fill') && (
            <ColorPicker
              strokeColor={strokeColor}
              onColorChange={handleColorChange}
              colorOptions={colorOptions}
            />
          )}

          {activeTool === 'pen' && (
            <LineWidthPicker
              lineWidth={lineWidth}
              onLineWidthChange={handleLineWidthChange}
              lineWidthOptions={lineWidthOptions}
            />
          )}

          {activeTool === 'eraser' && (
            <EraserSizePicker
              eraseSize={eraseSize}
              onEraserSizeChange={handleEraserSizeChange}
              eraserSizeOptions={eraserSizeOptions}
            />
          )}
        </div>

        <CanvasActions
          onClear={clearCanvas}
          onSave={saveCanvas}
          onUndo={undo}
          onRedo={redo}
          canUndo={currentHistoryIndex > 0 && historyRef.current.length > 1}
          canRedo={currentHistoryIndex < historyRef.current.length - 1}
        />
      </div>
    </div>
  )
}

export default PaintingCanvas
