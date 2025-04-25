import { hover, transparentForm } from '@/styles/form'

interface ButtonProps {
  text: string
  border?: boolean
  onClick?: () => void
  fill?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const Button = ({
  text,
  border = false,
  onClick,
  fill = false,
  disabled = false,
  type = 'button',
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${border ? 'border border-1-white' : ''}
      ${fill ? 'w-full' : ''}
      ${transparentForm} ${hover} px-3 py-2 rounded-lg text-xl cursor-pointer active:scale-95 transition-transform duration-200`}
    >
      {text}
    </button>
  )
}

export default Button
