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

type Tool = 'pen' | 'eraser'

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

  // 그림 히스토리 저장
  const historyRef = useRef<string[]>([])
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1)

  // 그리기 시작할 때도 히스토리 저장 여부 확인
  const [shouldSaveOnStop, setShouldSaveOnStop] = useState(false)

  // 현재 캔버스 상태 저장
  const saveToHistory = useCallback(() => {
    const canvas = canvasRefToUse.current
    if (!canvas) return

    const dataURL = canvas.toDataURL('image/png')

    // 현재 인덱스 이후의 히스토리는 제거 (다시 그린 경우)
    historyRef.current = [...historyRef.current.slice(0, currentHistoryIndex + 1), dataURL]

    setCurrentHistoryIndex(currentHistoryIndex + 1)
  }, [canvasRefToUse, currentHistoryIndex])

  // 초기 이미지 로드
  useEffect(() => {
    if (initialImage) {
      const canvas = canvasRefToUse.current
      if (!canvas) return

      const context = canvas.getContext('2d', { willReadFrequently: true })
      if (!context) return

      // 이미지를 Blob으로 가져오기
      fetch(`/api/v1/characters/image/proxy?url=${encodeURIComponent(initialImage)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('이미지 로드 실패')
          }
          return response.blob()
        })
        .then((blob) => {
          const img = new Image()
          img.crossOrigin = 'anonymous'

          img.onload = () => {
            try {
              const container = canvas.parentElement
              if (container) {
                // 컨테이너 크기에 맞게 캔버스 크기 설정
                const containerWidth = container.clientWidth
                const scale = containerWidth / img.width
                const newWidth = containerWidth
                const newHeight = img.height * scale

                // 캔버스 크기 설정
                canvas.width = newWidth
                canvas.height = newHeight
                setCanvasWidth(newWidth)
                setCanvasHeight(newHeight)

                // 이미지 그리기
                context.clearRect(0, 0, canvas.width, canvas.height)
                context.drawImage(img, 0, 0, newWidth, newHeight)

                // 원본 이미지 상태 저장
                const originalImageData = canvas.toDataURL('image/png')
                // 빈 캔버스 상태 추가 (첫 번째 그리기를 위한 상태)
                context.clearRect(0, 0, canvas.width, canvas.height)
                context.drawImage(img, 0, 0, newWidth, newHeight)
                const firstStateData = canvas.toDataURL('image/png')

                // 두 상태를 모두 히스토리에 저장
                historyRef.current = [originalImageData, firstStateData]
                setCurrentHistoryIndex(1)
              }
            } catch (error) {
              console.error('이미지 로드 중 오류 발생:', error)
              // 이미지 로드 실패 시 빈 캔버스로 초기화
              context.clearRect(0, 0, canvas.width, canvas.height)
              const dataURL = canvas.toDataURL('image/png')
              historyRef.current = [dataURL]
              setCurrentHistoryIndex(0)
            }
          }

          img.onerror = () => {
            console.error('이미지 로드 실패')
            // 이미지 로드 실패 시 빈 캔버스로 초기화
            context.clearRect(0, 0, canvas.width, canvas.height)
            const dataURL = canvas.toDataURL('image/png')
            historyRef.current = [dataURL]
            setCurrentHistoryIndex(0)
          }

          const objectUrl = URL.createObjectURL(blob)
          img.src = objectUrl

          // 메모리 누수 방지를 위해 URL 해제
          return () => URL.revokeObjectURL(objectUrl)
        })
        .catch((error) => {
          console.error('이미지 가져오기 실패:', error)
          // 이미지 로드 실패 시 빈 캔버스로 초기화
          context.clearRect(0, 0, canvas.width, canvas.height)
          const dataURL = canvas.toDataURL('image/png')
          historyRef.current = [dataURL]
          setCurrentHistoryIndex(0)
        })
    }
  }, [initialImage, canvasRefToUse])

  // 실행 취소 (Undo)
  const undo = useCallback(() => {
    if (currentHistoryIndex <= 0 || historyRef.current.length <= 1) {
      return // 더 이상 실행 취소할 수 없음
    }

    const canvas = canvasRefToUse.current
    if (!canvas) return

    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) return

    const newIndex = currentHistoryIndex - 1
    setCurrentHistoryIndex(newIndex)

    if (newIndex === 0) {
      // 첫 상태로 되돌아가면 캔버스 초기화
      context.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    // 이전 상태 불러오기
    const img = new Image()
    img.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(img, 0, 0)
    }
    img.src = historyRef.current[newIndex]
  }, [canvasRefToUse, currentHistoryIndex])

  // 다시 실행 (Redo)
  const redo = useCallback(() => {
    if (currentHistoryIndex >= historyRef.current.length - 1) {
      return // 더 이상 다시 실행할 수 없음
    }

    const canvas = canvasRefToUse.current
    if (!canvas) return

    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) return

    const newIndex = currentHistoryIndex + 1
    setCurrentHistoryIndex(newIndex)

    // 다음 상태 불러오기
    const img = new Image()
    img.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(img, 0, 0)
    }
    img.src = historyRef.current[newIndex]
  }, [canvasRefToUse, currentHistoryIndex])

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

  const draw = useCallback(
    (event: ReactMouseEvent | ReactTouchEvent) => {
      if ('touches' in event && event.cancelable) {
        event.preventDefault()
      }
      if (!isDrawing || !canvasRefToUse.current) return

      const context = canvasRefToUse.current.getContext('2d', { willReadFrequently: true })
      if (!context || !lastPosition) return

      const currentPosition = getCanvasCoordinates(event)

      if (activeTool === 'pen') {
        context.save()
        context.beginPath()
        context.moveTo(lastPosition.x, lastPosition.y)
        context.lineTo(currentPosition.x, currentPosition.y)
        context.strokeStyle = strokeColor
        context.lineWidth = lineWidth
        context.lineCap = 'round'
        context.lineJoin = 'round'
        context.stroke()
        context.restore()
      } else if (activeTool === 'eraser') {
        context.save()
        context.globalCompositeOperation = 'destination-out'
        context.beginPath()
        context.arc(currentPosition.x, currentPosition.y, eraseSize / 2, 0, Math.PI * 2)
        context.fill()
        context.restore()
      }

      setLastPosition(currentPosition)
    },
    [
      isDrawing,
      activeTool,
      lastPosition,
      getCanvasCoordinates,
      strokeColor,
      lineWidth,
      eraseSize,
      canvasRefToUse,
    ],
  )

  const startDrawing = useCallback(
    (event: ReactMouseEvent | ReactTouchEvent) => {
      if ('touches' in event && event.cancelable) {
        event.preventDefault()
      }
      setIsDrawing(true)
      setShouldSaveOnStop(true)
      const position = getCanvasCoordinates(event)
      setLastPosition(position)

      if (activeTool === 'eraser') {
        const context = canvasRefToUse.current?.getContext('2d', { willReadFrequently: true })
        if (context) {
          context.save()
          context.globalCompositeOperation = 'destination-out'
          context.beginPath()
          context.arc(position.x, position.y, eraseSize / 2, 0, Math.PI * 2)
          context.fill()
          context.restore()
        }
      }
    },
    [activeTool, getCanvasCoordinates, eraseSize, canvasRefToUse],
  )

  const stopDrawing = useCallback(() => {
    if (isDrawing && shouldSaveOnStop) {
      const canvas = canvasRefToUse.current
      if (canvas) {
        const dataURL = canvas.toDataURL('image/png')
        historyRef.current = [...historyRef.current.slice(0, currentHistoryIndex + 1), dataURL]
        setCurrentHistoryIndex(currentHistoryIndex + 1)
      }
    }
    setIsDrawing(false)
    setShouldSaveOnStop(false)
    setLastPosition(null)
  }, [isDrawing, shouldSaveOnStop, currentHistoryIndex, canvasRefToUse])

  const clearCanvas = () => {
    const canvas = canvasRefToUse.current
    if (!canvas) return

    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      saveToHistory() // 캔버스 클리어 후 히스토리에 저장
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
      if (container && !initialImage) {
        // initialImage가 없을 때만 크기 조정
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

          // 캔버스 초기화 후 히스토리 초기화
          historyRef.current = []
          setCurrentHistoryIndex(-1)
        }
      }
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [canvasRefToUse, initialImage])

  // 캔버스에 그리기 설정 업데이트
  useEffect(() => {
    const canvas = canvasRefToUse.current
    if (canvas) {
      const context = canvas.getContext('2d', { willReadFrequently: true })
      if (context) {
        // 컨텍스트 설정 초기화 (스케일 포함)
        context.setTransform(1, 0, 0, 1, 0, 0)
        context.scale(dpr, dpr)

        context.lineWidth = lineWidth
        context.lineCap = 'round'
        context.strokeStyle = strokeColor
        context.lineJoin = 'round' // 선 연결 부분을 부드럽게
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
      if (e.cancelable) {
        e.preventDefault()
      }
      startDrawing(e as unknown as ReactTouchEvent)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.cancelable) {
        e.preventDefault()
      }
      draw(e as unknown as ReactTouchEvent)
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.cancelable) {
        e.preventDefault()
      }
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

  // 컴포넌트 마운트 시 빈 캔버스 상태를 히스토리에 추가
  useEffect(() => {
    // 첫 렌더링 후 빈 캔버스 상태 저장
    const timeoutId = setTimeout(() => {
      const canvas = canvasRefToUse.current
      if (canvas) {
        const context = canvas.getContext('2d', { willReadFrequently: true })
        if (context) {
          // 캔버스가 비어 있는지 확인
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data
          const isEmpty = !imageData.some((channel) => channel !== 0)

          if (isEmpty && historyRef.current.length === 0) {
            saveToHistory()
          }
        }
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [canvasRefToUse, saveToHistory])

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
                  <label
                    className={`w-8 h-8 flex items-center justify-center border rounded ${transparentForm} ${hover} cursor-pointer relative`}
                  >
                    <input
                      type="color"
                      value={strokeColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="relative">
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: strokeColor,
                          borderRadius: '50%',
                          border: '1px solid #e5e7eb',
                        }}
                      />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center border border-gray-300">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          className="w-2 h-2 text-gray-600"
                          aria-hidden="true"
                        >
                          <title>색상 선택기</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                    </div>
                  </label>
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

        <div className="flex justify-center mt-2 gap-3">
          <div
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer active:scale-90 w-fit h-fit transition-transform duration-200"
            onClick={clearCanvas}
            title="모두 지우기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <title>모두 지우기</title>
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>
          <div
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer active:scale-90 w-fit h-fit transition-transform duration-200"
            onClick={saveCanvas}
            title="그림 저장하기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <title>그림 저장하기</title>
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
          </div>
          <div
            className={`p-1.5 rounded-md ${currentHistoryIndex <= 0 || historyRef.current.length <= 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer active:scale-90'} w-fit h-fit transition-transform duration-200`}
            onClick={currentHistoryIndex <= 0 || historyRef.current.length <= 1 ? undefined : undo}
            title="실행 취소 (Ctrl+Z)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <title>실행 취소</title>
              <polyline points="9 14 4 9 9 4" />
              <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
            </svg>
          </div>
          <div
            className={`p-1.5 rounded-md ${currentHistoryIndex >= historyRef.current.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer active:scale-90'} w-fit h-fit transition-transform duration-200`}
            onClick={currentHistoryIndex >= historyRef.current.length - 1 ? undefined : redo}
            title="다시 실행 (Ctrl+Shift+Z)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <title>다시 실행</title>
              <polyline points="15 4 20 9 15 14" />
              <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaintingCanvas
