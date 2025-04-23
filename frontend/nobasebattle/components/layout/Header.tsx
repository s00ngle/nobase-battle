import ThemeToggleButton from '../common/ThemeToggleButton'

const Header = () => {
  return (
    <div className="flex p-3 absolute top-0">
      <div className="text-4xl text-accent  whitespace-nowrap">너 개약하자나;</div>
      <div className="fixed right-4">
        <ThemeToggleButton />
      </div>
    </div>
  )
}

export default Header
