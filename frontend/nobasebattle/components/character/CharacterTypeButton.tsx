import { hover, transparentForm } from '@/styles/form'

interface CharacterTypeButtonProps {
  text: string
  selected?: boolean
  onClick?: () => void
}

const CharacterTypeButton = ({ text, selected = false, onClick }: CharacterTypeButtonProps) => {
  return (
    <button
      type="button"
      className={`w-27 rounded-full
        ${selected ? 'border border-gray-800 dark:border-gray-200' : ''}
        ${transparentForm} ${hover} cursor-pointer`}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default CharacterTypeButton
