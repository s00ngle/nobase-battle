'use client'

import { hover, transparentForm } from '@/styles/form'

interface InputBoxProps {
  label?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
}

const InputBox = ({ label, value, onChange, type = 'text' }: InputBoxProps) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`${transparentForm} ${hover} w-full text-sm px-3 py-3 rounded-xl focus:outline-none focus:border-white border border-transparent`}
      />
    </div>
  )
}

export default InputBox
