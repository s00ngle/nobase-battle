'use client'

import { hover, transparentForm } from '@/styles/form'
import { useState } from 'react'

interface TextAreaProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  required?: boolean
}

const TextArea: React.FC<TextAreaProps> = ({ label, value, onChange, required = false }) => {
  const [textLength, setTextLength] = useState<number>(value ? value.length : 0)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextLength(e.target.value.length)
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="description"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <textarea
        id="description"
        value={value}
        onChange={handleChange}
        className={`${transparentForm} ${hover} w-full text-sm px-3 py-3 rounded-xl focus:outline-none focus:border-white border border-transparent resize-none`}
        rows={4}
        maxLength={100}
        placeholder="캐릭터 설명을 입력하세요"
        required={required}
      />
      <span className="text-end text-sm">{textLength}/100</span>
    </div>
  )
}

export default TextArea
