import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react'

type Tool = 'pen' | 'eraser'

interface UseDrawingToolsProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  saveToHistory: () => void
}

export const useDrawingTools = ({ canvasRef, saveToHistory }: UseDrawingToolsProps) => {
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null)
  const [strokeColor, setStrokeColor] = useState('#000000')
  const [lineWidth, setLineWidth] = useState(2)
  const [activeTool, setActiveTool] = useState<Tool>('pen')
  const [eraseSize, setEraseSize] = useState(20)
  const [shouldSaveOnStop, setShouldSaveOnStop] = useState(false)
  const eraserCursorRef = useRef<HTMLDivElement | null>(null)

  const getCanvasCoordinates = useCallback(
    (event: ReactMouseEvent | ReactTouchEvent) => {
      const canvas = canvasRef.current
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
    [canvasRef],
  )

  const draw = useCallback(
    (event: ReactMouseEvent | ReactTouchEvent) => {
      if ('touches' in event && event.cancelable) {
        event.preventDefault()
      }
      if (!isDrawing || !canvasRef.current) return

      const context = canvasRef.current.getContext('2d', { willReadFrequently: true })
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
      canvasRef,
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
        const context = canvasRef.current?.getContext('2d', { willReadFrequently: true })
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
    [activeTool, getCanvasCoordinates, eraseSize, canvasRef],
  )

  const stopDrawing = useCallback(() => {
    if (isDrawing && shouldSaveOnStop) {
      saveToHistory()
    }
    setIsDrawing(false)
    setShouldSaveOnStop(false)
    setLastPosition(null)
  }, [isDrawing, shouldSaveOnStop, saveToHistory])

  const updateEraserCursor = useCallback(
    (event: globalThis.MouseEvent) => {
      if (activeTool !== 'eraser' || !eraserCursorRef.current) return

      const canvas = canvasRef.current
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
    [activeTool, eraseSize, canvasRef],
  )

  const hideEraserCursor = useCallback(() => {
    if (eraserCursorRef.current) {
      eraserCursorRef.current.style.display = 'none'
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener('mousemove', updateEraserCursor)
      canvas.addEventListener('mouseleave', hideEraserCursor)

      return () => {
        canvas.removeEventListener('mousemove', updateEraserCursor)
        canvas.removeEventListener('mouseleave', hideEraserCursor)
      }
    }
  }, [updateEraserCursor, hideEraserCursor, canvasRef])

  useEffect(() => {
    const canvas = canvasRef.current
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
  }, [canvasRef, draw, startDrawing, stopDrawing])

  return {
    isDrawing,
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
  }
}
