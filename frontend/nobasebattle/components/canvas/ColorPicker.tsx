import { hover, transparentForm } from '@/styles/form'

interface ColorPickerProps {
  strokeColor: string
  onColorChange: (color: string) => void
  colorOptions: string[]
}

export const ColorPicker = ({ strokeColor, onColorChange, colorOptions }: ColorPickerProps) => {
  return (
    <div className="mt-3 mb-3">
      <p className="text-sm mb-2 font-medium">색상 선택</p>
      <div className="flex space-x-2">
        <label
          className={`w-8 h-8 flex items-center justify-center border rounded ${transparentForm} ${hover} cursor-pointer relative`}
        >
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => onColorChange(e.target.value)}
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
            className={`w-8 h-8 flex items-center justify-center border rounded ${transparentForm} ${hover} ${
              strokeColor === color ? 'bg-gray-500/20 dark:bg-white/20' : 'border-transparent'
            } cursor-pointer`}
            onClick={() => onColorChange(color)}
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
  )
}
