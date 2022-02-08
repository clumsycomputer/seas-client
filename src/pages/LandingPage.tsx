import { UserPage } from '../components/Page'
import { useCurrentUser } from '../hooks/useCurrentUser'

export function LandingPage() {
  const currentUser = useCurrentUser()
  return <UserPage currentUser={currentUser} pageBody={null} />
}
