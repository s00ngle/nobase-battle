'use client'

import { hover, transparentForm } from '@/styles/form'
import { useState } from 'react'

interface TextAreaProps {
  label?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const TextArea = ({ label, value, onChange }: TextAreaProps) => {
  const [textLength, setTextLength] = useState<number>(value ? value.length : 0)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextLength(e.target.value.length)
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm">{label}</span>
      <textarea
        value={value}
        onChange={handleChange}
        rows={3}
        maxLength={100}
        className={`${transparentForm} ${hover} w-full text-sm px-3 py-3 rounded-xl focus:outline-none focus:border-white border border-transparent resize-none`}
      />
      <span className="text-end text-sm">{textLength}/100</span>
    </div>
  )
}

export default TextArea
