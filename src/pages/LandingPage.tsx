import { LoggedInUserPage, LoggedOutUserPage } from '../components/Page'
import { useCurrentUser } from '../hooks/useCurrentUser'

export function LandingPage() {
  const currentUser = useCurrentUser()
  return currentUser === null ? (
    <LoggedOutUserPage pageBody={null} />
  ) : (
    <LoggedInUserPage currentUser={currentUser} pageBody={null} />
  )
}
