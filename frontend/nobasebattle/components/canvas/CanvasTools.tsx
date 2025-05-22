import { hover, transparentForm } from '@/styles/form'

type Tool = 'pen' | 'eraser' | 'fill'

interface CanvasToolsProps {
  activeTool: Tool
  onToolChange: (tool: Tool) => void
}

export const CanvasTools = ({ activeTool, onToolChange }: CanvasToolsProps) => {
  return (
    <div className="mt-4 mb-2">
      <p className="text-sm mb-2 font-medium">도구 선택</p>
      <div className="flex space-x-2">
        <button
          type="button"
          className={`px-3 py-1 rounded cursor-pointer border ${transparentForm} ${hover} ${
            activeTool === 'pen' ? 'bg-gray-500/20 dark:bg-white/20' : 'border-transparent'
          }`}
          onClick={() => onToolChange('pen')}
        >
          펜
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded cursor-pointer border ${transparentForm} ${hover} ${
            activeTool === 'eraser' ? 'bg-gray-500/20 dark:bg-white/20' : 'border-transparent'
          }`}
          onClick={() => onToolChange('eraser')}
        >
          지우개
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded cursor-pointer border ${transparentForm} ${hover} ${
            activeTool === 'fill' ? 'bg-gray-500/20 dark:bg-white/20' : 'border-transparent'
          }`}
          onClick={() => onToolChange('fill')}
        >
          채우기
        </button>
      </div>
    </div>
  )
}
