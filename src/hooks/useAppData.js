import { useContext } from 'react'
import { AppDataContext } from '../context/appDataContext'

export function useAppData() {
  return useContext(AppDataContext)
}
