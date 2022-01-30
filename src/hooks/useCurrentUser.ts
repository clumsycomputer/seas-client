import { useMemo } from 'react'
import { CurrentUser } from '../models/User'

export function useCurrentUser() {
  return useMemo(() => {
    const currentUserItem = window.localStorage.getItem('currentUser')
    const currentUser = currentUserItem
      ? (JSON.parse(currentUserItem!) as CurrentUser)
      : null
    return currentUser
  }, [])
}
