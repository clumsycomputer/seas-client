import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingPageBody } from '../components/LoadingPageBody'
import { UserlessPage } from '../components/Page'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useTask } from '../hooks/useTask'
import { SeasService } from '../services/SeasService'

export function SignOutPage() {
  const currentUser = useCurrentUser()
  const navigateToPage = useNavigate()
  const [cancelAuthTokenState, cancelAuthToken] = useTask(async () => {
    if (currentUser) {
      await SeasService.cancelAuthToken({
        apiToken: currentUser.apiToken,
      })
    }
  })
  useEffect(() => {
    cancelAuthToken()
  }, [])
  useEffect(() => {
    if (cancelAuthTokenState.taskStatus === 'taskSuccessful') {
      window.localStorage.removeItem('currentUser')
      const currentSearchParams = new URLSearchParams(window.location.search)
      const targetRoute = currentSearchParams.get('target-route')
      navigateToPage(targetRoute || '/', {
        replace: true,
      })
    }
  }, [cancelAuthTokenState])
  return <UserlessPage pageBody={<LoadingPageBody />} />
}
