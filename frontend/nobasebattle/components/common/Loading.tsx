import { SyncLoader } from 'react-spinners'

interface LoadingProps {
  className?: string
}

const Loading = ({ className }: LoadingProps) => {
  return (
    <div className={`${className}`}>
      <SyncLoader color="#ffffff" />
    </div>
  )
}

export default Loading
