'use client'

import { hover, transparentForm } from '@/styles/form'
import type React from 'react'
import {
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import Button from './Button'

type Tool = 'pen' | 'eraser'

interface PaintingCanvasProps {
  canvasRef?: React.RefObject<HTMLCanvasElement | null>
}

const PaintingCanvas: React.FC<PaintingCanvasProps> = ({ canvasRef: externalCanvasRef }) => {
  const internalCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasRefToUse = externalCanvasRef || internalCanvasRef
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPosition, setLastPosition] = useState<{
    x: number
    y: number
  } | null>(null)
  const [strokeColor, setStrokeColor] = useState('#000000')
  const [lineWidth, setLineWidth] = useState(2)
  const [activeTool, setActiveTool] = useState<Tool>('pen')
  const [eraseSize, setEraseSize] = useState(20)
  const eraserCursorRef = useRef<HTMLDivElement | null>(null)

  // 색상 옵션
  const colorOptions = ['#000000', '#FF0000', '#0000FF', '#008000', '#800080', '#FFA500']

  // 선 굵기 옵션
  const lineWidthOptions = [1, 2, 4, 6]

  // 지우개 크기 옵션
  const eraserSizeOptions = [10, 20, 30, 40]

  // 캔버스 크기 상태
  const [canvasWidth, setCanvasWidth] = useState(400)
  const [canvasHeight, setCanvasHeight] = useState(250)

  // 디바이스 픽셀 비율 저장
  const [dpr] = useState(1)

  const getCanvasCoordinates = useCallback(
    (event: ReactMouseEvent | ReactTouchEvent) => {
      const canvas = canvasRefToUse.current
      if (!canvas) return { x: 0, y: 0 }

      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height

      if ('touches' in event) {
        const touch = event.touches[0]
        return {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY,
        }
      }
      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY,
      }
    },
    [canvasRefToUse],
  )

  const erase = useCallback(
    (position: { x: number; y: number }) => {
      const canvas = canvasRefToUse.current
      if (!canvas) return

      const context = canvas.getContext('2d')
      if (!context) return

      context.save()
      context.globalCompositeOperation = 'destination-out'
      context.beginPath()
      context.arc(position.x, position.y, eraseSize / 2, 0, Math.PI * 2)
      context.fill()
      context.restore()
    },
    [eraseSize, canvasRefToUse],
  )

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
    setLastPosition(null)
  }, [])

  const startDrawing = useCallback(
    (event: ReactMouseEvent | ReactTouchEvent) => {
      // 터치 이벤트일 경우 기본 동작 방지
      if ('touches' in event) {
        event.preventDefault()
      }
      setIsDrawing(true)
      const position = getCanvasCoordinates(event)
      setLastPosition(position)

      if (activeTool === 'eraser') {
        erase(position)
      }
    },
    [activeTool, getCanvasCoordinates, erase],
  )

  const draw = useCallback(
    (event: ReactMouseEvent | ReactTouchEvent) => {
      // 터치 이벤트일 경우 기본 동작 방지
      if ('touches' in event) {
        event.preventDefault()
      }
      if (!isDrawing || !canvasRefToUse.current) return

      const context = canvasRefToUse.current.getContext('2d')
      if (!context || !lastPosition) return

      const currentPosition = getCanvasCoordinates(event)

      if (activeTool === 'pen') {
        context.beginPath()
        context.moveTo(lastPosition.x, lastPosition.y)
        context.lineTo(currentPosition.x, currentPosition.y)
        context.stroke()
      } else if (activeTool === 'eraser') {
        erase(currentPosition)
      }

      setLastPosition(currentPosition)
    },
    [isDrawing, activeTool, lastPosition, getCanvasCoordinates, erase, canvasRefToUse],
  )

  const clearCanvas = () => {
    const canvas = canvasRefToUse.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const saveCanvas = () => {
    const canvas = canvasRefToUse.current
    if (!canvas) return

    const dataURL = canvas.toDataURL('image/png')

    // 다운로드 링크 생성
    const link = document.createElement('a')
    link.href = dataURL
    link.download = `my-drawing-${new Date().toISOString().slice(0, 10)}.png`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleColorChange = (color: string) => {
    setStrokeColor(color)
    setActiveTool('pen')
  }

  const handleLineWidthChange = (width: number) => {
    setLineWidth(width)
    setActiveTool('pen')
  }

  const handleToolChange = (tool: Tool) => {
    setActiveTool(tool)
  }

  const handleEraserSizeChange = (size: number) => {
    setEraseSize(size)
  }

  // 마우스 이동 시 지우개 커서 위치 업데이트
  const updateEraserCursor = useCallback(
    (event: globalThis.MouseEvent) => {
      if (activeTool !== 'eraser' || !eraserCursorRef.current) return

      const canvas = canvasRefToUse.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        eraserCursorRef.current.style.display = 'block'
        eraserCursorRef.current.style.left = `${x}px`
        eraserCursorRef.current.style.top = `${y}px`
        eraserCursorRef.current.style.width = `${eraseSize}px`
        eraserCursorRef.current.style.height = `${eraseSize}px`
      } else {
        eraserCursorRef.current.style.display = 'none'
      }
    },
    [activeTool, eraseSize, canvasRefToUse],
  )

  // 지우개 커서 숨기기
  const hideEraserCursor = useCallback(() => {
    if (eraserCursorRef.current) {
      eraserCursorRef.current.style.display = 'none'
    }
  }, [])

  // 캔버스 크기 설정 및 디바이스 픽셀 비율 감지
  useEffect(() => {
    const updateCanvasSize = () => {
      const container = canvasRefToUse.current?.parentElement
      if (container) {
        // 부모 요소의 크기에 맞게 설정
        const newWidth = container.clientWidth
        // 적절한 비율 유지 (예: 16:9)
        const newHeight = Math.floor((newWidth * 9) / 16)

        setCanvasWidth(newWidth)
        setCanvasHeight(newHeight)

        // 캔버스 요소가 있으면 크기 즉시 업데이트
        const canvas = canvasRefToUse.current
        if (canvas) {
          canvas.width = newWidth
          canvas.height = newHeight
        }
      }
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [canvasRefToUse])

  // 캔버스에 그리기 설정 업데이트
  useEffect(() => {
    const canvas = canvasRefToUse.current
    if (canvas) {
      const context = canvas.getContext('2d')
      if (context) {
        // 컨텍스트 설정 초기화 (스케일 포함)
        context.setTransform(1, 0, 0, 1, 0, 0)
        context.scale(dpr, dpr)

        context.lineWidth = lineWidth
        context.lineCap = 'round'
        context.strokeStyle = strokeColor
      }
    }
  }, [strokeColor, lineWidth, dpr, canvasRefToUse])

  // 캔버스에 마우스 이벤트 리스너 등록
  useEffect(() => {
    const canvas = canvasRefToUse.current
    if (canvas) {
      canvas.addEventListener('mousemove', updateEraserCursor)
      canvas.addEventListener('mouseleave', hideEraserCursor)

      return () => {
        canvas.removeEventListener('mousemove', updateEraserCursor)
        canvas.removeEventListener('mouseleave', hideEraserCursor)
      }
    }
  }, [updateEraserCursor, hideEraserCursor, canvasRefToUse])

  // 터치 이벤트 리스너 등록
  useEffect(() => {
    const canvas = canvasRefToUse.current
    if (!canvas) return

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      startDrawing(e as unknown as ReactTouchEvent)
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      draw(e as unknown as ReactTouchEvent)
    }

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault()
      stopDrawing()
    }

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false })
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false })

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
      canvas.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [canvasRefToUse, draw, startDrawing, stopDrawing])

  return (
    <div className="mt-4 flex flex-col gap-2">
      <span className="text-sm">캐릭터 그림</span>
      <div className={`w-full rounded-xl p-4 ${transparentForm}`}>
        <div className="relative">
          <canvas
            ref={canvasRefToUse}
            className="bg-white rounded-xl touch-none"
            style={{
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
              touchAction: 'none',
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
            }}
          />
        </div>

        {/* 도구 선택 영역 */}
        <div className="mt-4 mb-2">
          <p className="text-sm mb-2 font-medium">도구 선택</p>
          <div className="flex space-x-2">
            <button
              type="button"
              className={`px-3 py-1 rounded cursor-pointer border ${transparentForm} ${hover} ${activeTool === 'pen' ? 'bg-gray-500/20 dark:bg-white/20' : 'border-transparent'}`}
              onClick={() => handleToolChange('pen')}
            >
              펜
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded cursor-pointer border ${transparentForm} ${hover} ${activeTool === 'eraser' ? 'bg-gray-500/20 dark:bg-white/20 ' : 'border-transparent'}`}
              onClick={() => handleToolChange('eraser')}
            >
              지우개
            </button>
          </div>
        </div>

        <div className="flex justify-between flex-wrap gap-x-4">
          {/* 펜 설정 영역 */}
          {activeTool === 'pen' && (
            <>
              <div className="mt-3 mb-3">
                <p className="text-sm mb-2 font-medium">색상 선택</p>
                <div className="flex space-x-2">
                  {colorOptions.map((color) => (
                    <button
                      type="button"
                      key={color}
                      className={`w-8 h-8 flex items-center justify-center border rounded ${transparentForm} ${hover} ${strokeColor === color ? 'bg-gray-500/20 dark:bg-white/20' : 'border-transparent'} cursor-pointer`}
                      onClick={() => handleColorChange(color)}
                      aria-label={`${color} 색상 선택`}
                    >
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: color,
                          borderRadius: '50%',
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3 mt-3">
                <p className="text-sm mb-2 font-medium">선 굵기</p>
                <div className="flex space-x-2">
                  {lineWidthOptions.map((width) => (
                    <button
                      type="button"
                      key={width}
                      className={`w-8 h-8 flex items-center justify-center border rounded ${transparentForm} ${hover} ${lineWidth === width ? 'bg-gray-500/20 dark:bg-white/20' : 'border-transparent'} cursor-pointer`}
                      onClick={() => handleLineWidthChange(width)}
                      aria-label={`${width}px 선 굵기 선택`}
                    >
                      <div
                        className="bg-gray-800 dark:bg-gray-200"
                        style={{
                          width: '80%',
                          height: `${width}px`,
                          borderRadius: '2px',
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 지우개 설정 영역 */}
          {activeTool === 'eraser' && (
            <div className="mt-3 mb-3">
              <p className="text-sm mb-2 font-medium">지우개 크기</p>
              <div className="flex space-x-2">
                {eraserSizeOptions.map((size) => (
                  <button
                    type="button"
                    key={size}
                    className={`w-8 h-8 flex items-center justify-center border rounded ${transparentForm} ${hover} ${eraseSize === size ? 'bg-gray-500/20 dark:bg-white/20' : 'border-transparent'} cursor-pointer`}
                    onClick={() => handleEraserSizeChange(size)}
                    aria-label={`${size}px 지우개 크기 선택`}
                  >
                    <div
                      className="bg-gray-800 dark:bg-gray-200"
                      style={{
                        width: `${size / 2}px`,
                        height: `${size / 2}px`,
                        borderRadius: '50%',
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-2 space-x-3">
          <Button text="모두 지우기" onClick={clearCanvas} />
          <Button text="그림 저장하기" onClick={saveCanvas} />
        </div>
      </div>
    </div>
  )
}

export default PaintingCanvas
