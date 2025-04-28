import { characterData } from '@/data/characterInfo'
import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json(characterData)
}
