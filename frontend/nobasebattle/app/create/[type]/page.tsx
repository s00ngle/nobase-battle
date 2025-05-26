'use client'

import { useCharacterStore } from '@/store/characterStore'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

const CreatePage = () => {
  const { type } = useParams()
  const { setSelectedType } = useCharacterStore()

  useEffect(() => {
    if (type === 'text' || type === 'image') {
      setSelectedType(type)
    }
  }, [type, setSelectedType])
}

export default CreatePage
