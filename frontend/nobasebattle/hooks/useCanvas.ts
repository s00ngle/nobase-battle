import { useCallback, useEffect, useRef, useState } from 'react'
import type {} from 'react'

interface UseCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  initialImage?: string
}

export const useCanvas = ({ canvasRef, initialImage }: UseCanvasProps) => {
  const historyRef = useRef<string[]>([])
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1)
  const isInitialImageLoaded = useRef(false)

  // 초기 이미지 로드
  useEffect(() => {
    if (!initialImage || !canvasRef.current) {
      console.log('No initial image or canvas ref:', {
        initialImage,
        hasCanvas: !!canvasRef.current,
      })
      return
    }

    console.log('Starting to load initial image:', initialImage)
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const context = canvas.getContext('2d', { willReadFrequently: true })
      if (!context) return

      console.log('Image loaded successfully:', {
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
      })

      // 이미지를 캔버스 크기에 맞게 그리기
      context.clearRect(0, 0, canvas.width, canvas.height)

      // 이미지 비율 유지하면서 캔버스에 맞추기
      const imgRatio = img.naturalWidth / img.naturalHeight
      const canvasRatio = canvas.width / canvas.height

      let drawWidth = canvas.width
      let drawHeight = canvas.height
      let offsetX = 0
      let offsetY = 0

      if (imgRatio > canvasRatio) {
        drawHeight = canvas.width / imgRatio
        offsetY = (canvas.height - drawHeight) / 2
      } else {
        drawWidth = canvas.height * imgRatio
        offsetX = (canvas.width - drawWidth) / 2
      }

      console.log('Drawing image with dimensions:', {
        drawWidth,
        drawHeight,
        offsetX,
        offsetY,
      })

      // 이미지 그리기
      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

      try {
        // 히스토리에 초기 상태 저장
        const dataURL = canvas.toDataURL('image/png')
        historyRef.current = [dataURL]
        setCurrentHistoryIndex(0)
        isInitialImageLoaded.current = true
        console.log('Initial image saved to history')
      } catch (error) {
        console.error('Failed to save initial image to history:', error)
      }
    }

    img.onerror = (error) => {
      console.error('Failed to load image:', error)
    }

    // 프록시를 통해 이미지 로드
    const proxyUrl = `/api/next/characters/image/proxy?url=${encodeURIComponent(initialImage)}`
    console.log('Loading image from proxy URL:', proxyUrl)
    img.src = proxyUrl

    // 컴포넌트 언마운트 시 cleanup
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [initialImage, canvasRef])

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
    currentHistoryIndex,
    historyRef,
    undo,
    redo,
    clearCanvas,
    saveCanvas,
    saveToHistory,
  }
}
