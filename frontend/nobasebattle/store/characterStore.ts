import { create } from 'zustand'

type CharacterType = 'text' | 'image'

interface CharacterStore {
  selectedType: CharacterType
  setSelectedType: (type: CharacterType) => void
}

export const useCharacterStore = create<CharacterStore>((set) => ({
  selectedType: 'text',
  setSelectedType: (type) => set({ selectedType: type }),
}))
