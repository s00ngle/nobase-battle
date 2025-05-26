import { hover, transparentForm } from '@/styles/form'

interface EraserSizePickerProps {
  eraseSize: number
  onEraserSizeChange: (size: number) => void
  eraserSizeOptions: number[]
}

export const EraserSizePicker = ({
  eraseSize,
  onEraserSizeChange,
  eraserSizeOptions,
}: EraserSizePickerProps) => {
  return (
    <div className="mt-3 mb-3">
      <p className="text-sm mb-2 font-medium">지우개 크기</p>
      <div className="flex space-x-2">
        {eraserSizeOptions.map((size) => (
          <button
            type="button"
            key={size}
            className={`w-8 h-8 flex items-center justify-center border rounded ${transparentForm} ${hover} ${
              eraseSize === size ? 'bg-gray-500/20 dark:bg-white/20' : 'border-transparent'
            } cursor-pointer`}
            onClick={() => onEraserSizeChange(size)}
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
  )
}
