import { transparentForm } from '@/styles/form'

interface SkeletonLoadingProps {
  className?: string
  width?: string
  height?: string
}

const SkeletonLoading = ({
  className = '',
  width = '100%',
  height = '1.5rem',
}: SkeletonLoadingProps) => {
  return (
    <div className={`${transparentForm} animate-pulse ${className}`} style={{ width, height }} />
  )
}

export default SkeletonLoading
