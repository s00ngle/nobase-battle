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
      setActiveTool('pen')
    },
    [setStrokeColor, setActiveTool],
  )

  const handleLineWidthChange = useCallback(
    (width: number) => {
      setLineWidth(width)
      setActiveTool('pen')
    },
    [setLineWidth, setActiveTool],
  )

  const handleToolChange = useCallback(
    (tool: 'pen' | 'eraser') => {
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

  return (
    <div className="mt-4 flex flex-col gap-2">
      <span className="text-sm">캐릭터 그림</span>
      <div className={`w-full rounded-xl p-4 ${transparentForm}`}>
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
          {activeTool === 'pen' && (
            <>
              <ColorPicker
                strokeColor={strokeColor}
                onColorChange={handleColorChange}
                colorOptions={colorOptions}
              />
              <LineWidthPicker
                lineWidth={lineWidth}
                onLineWidthChange={handleLineWidthChange}
                lineWidthOptions={lineWidthOptions}
              />
            </>
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
