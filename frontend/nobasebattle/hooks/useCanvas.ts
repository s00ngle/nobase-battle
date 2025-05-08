import { useCallback, useEffect, useRef, useState } from 'react'
import type {} from 'react'

interface UseCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  initialImage?: string
}

export const useCanvas = ({ canvasRef, initialImage }: UseCanvasProps) => {
  const [canvasWidth, setCanvasWidth] = useState(400)
  const [canvasHeight, setCanvasHeight] = useState(250)
  const historyRef = useRef<string[]>([])
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1)
  const isInitialImageLoaded = useRef(false)

  // 캔버스 크기 업데이트
  const updateCanvasSize = useCallback(() => {
    const container = canvasRef.current?.parentElement
    if (!container) return

    const newWidth = container.clientWidth
    const newHeight = Math.floor((newWidth * 9) / 16)

    setCanvasWidth(newWidth)
    setCanvasHeight(newHeight)

    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = newWidth
      canvas.height = newHeight
    }
  }, [canvasRef])

  // 초기 이미지 로드
  useEffect(() => {
    if (!initialImage || !canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) return

    // 캔버스 크기 먼저 업데이트
    updateCanvasSize()

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const context = canvas.getContext('2d', { willReadFrequently: true })
      if (!context) return

      // 이미지를 캔버스 크기에 맞게 그리기
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(img, 0, 0, canvas.width, canvas.height)

      try {
        // 히스토리에 초기 상태 저장
        const dataURL = canvas.toDataURL('image/png')
        historyRef.current = [dataURL]
        setCurrentHistoryIndex(0)
        isInitialImageLoaded.current = true
      } catch (error) {
        console.error('Failed to save initial image to history:', error)
      }
    }
    img.onerror = (error) => {
      console.error('Failed to load image:', error)
    }

    // 프록시를 통해 이미지 로드
    const proxyUrl = `/api/next/characters/image/proxy?url=${encodeURIComponent(initialImage)}`
    img.src = proxyUrl
  }, [initialImage, canvasRef, updateCanvasSize])

  // 윈도우 리사이즈 이벤트 처리
  useEffect(() => {
    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [updateCanvasSize])

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const dataURL = canvas.toDataURL('image/png')

      // 초기 이미지가 로드된 상태에서 첫 번째 획을 그릴 때
      if (isInitialImageLoaded.current && currentHistoryIndex === 0) {
        historyRef.current = [historyRef.current[0], dataURL]
        setCurrentHistoryIndex(1)
        isInitialImageLoaded.current = false
        return
      }

      // 그 외의 경우
      historyRef.current = [...historyRef.current.slice(0, currentHistoryIndex + 1), dataURL]
      setCurrentHistoryIndex(currentHistoryIndex + 1)
    } catch (error) {
      console.error('Failed to save to history:', error)
    }
  }, [canvasRef, currentHistoryIndex])

  const undo = useCallback(() => {
    if (currentHistoryIndex <= 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) return

    const newIndex = currentHistoryIndex - 1
    setCurrentHistoryIndex(newIndex)

    const img = new Image()
    img.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(img, 0, 0)
    }
    img.src = historyRef.current[newIndex]
  }, [canvasRef, currentHistoryIndex])

  const redo = useCallback(() => {
    if (currentHistoryIndex >= historyRef.current.length - 1) return

    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) return

    const newIndex = currentHistoryIndex + 1
    setCurrentHistoryIndex(newIndex)

    const img = new Image()
    img.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(img, 0, 0)
    }
    img.src = historyRef.current[newIndex]
  }, [canvasRef, currentHistoryIndex])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      saveToHistory()
    }
  }, [canvasRef, saveToHistory])

  const saveCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataURL = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataURL
    link.download = `my-drawing-${new Date().toISOString().slice(0, 10)}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [canvasRef])

  return {
    canvasWidth,
    canvasHeight,
    currentHistoryIndex,
    historyRef,
    undo,
    redo,
    clearCanvas,
    saveCanvas,
    saveToHistory,
  }
}
