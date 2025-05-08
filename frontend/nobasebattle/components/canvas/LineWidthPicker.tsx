import { hover, transparentForm } from '@/styles/form'

interface LineWidthPickerProps {
  lineWidth: number
  onLineWidthChange: (width: number) => void
  lineWidthOptions: number[]
}

export const LineWidthPicker = ({
  lineWidth,
  onLineWidthChange,
  lineWidthOptions,
}: LineWidthPickerProps) => {
  return (
    <div className="mb-3 mt-3">
      <p className="text-sm mb-2 font-medium">선 굵기</p>
      <div className="flex space-x-2">
        {lineWidthOptions.map((width) => (
          <button
            type="button"
            key={width}
            className={`w-8 h-8 flex items-center justify-center border rounded ${transparentForm} ${hover} ${
              lineWidth === width ? 'bg-gray-500/20 dark:bg-white/20' : 'border-transparent'
            } cursor-pointer`}
            onClick={() => onLineWidthChange(width)}
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
  )
}
