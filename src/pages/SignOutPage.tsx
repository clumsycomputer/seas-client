import { ReactNode, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorPageBody } from '../components/ErrorPageBody'
import { LoadingPageBody } from '../components/LoadingPageBody'
import { UserlessPage } from '../components/Page'
import { getSeasServiceErrorMessage } from '../helpers/getSeasServiceErrorMessage'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useTask } from '../hooks/useTask'
import { SeasService } from '../services/SeasService'

export function SignOutPage() {
  const currentUser = useCurrentUser()
  const navigateToPage = useNavigate()
  const [pageBody, setPageBody] = useState<ReactNode>(<LoadingPageBody />)
  const [deleteCurrentUserState, deleteCurrentUser] = useTask(async () => {
    if (currentUser) {
      await SeasService.deleteCurrentUser({
        apiToken: currentUser.apiToken,
      })
    }
  })
  useEffect(() => {
    deleteCurrentUser()
  }, [])
  useEffect(() => {
    if (deleteCurrentUserState.taskStatus === 'taskSuccessful') {
      window.localStorage.removeItem('currentUser')
      const currentSearchParams = new URLSearchParams(window.location.search)
      const targetRoute = currentSearchParams.get('target-route')
      navigateToPage(targetRoute || '/', {
        replace: true,
      })
    } else if (deleteCurrentUserState.taskStatus === 'taskError') {
      const seasServiceErrorMessage = getSeasServiceErrorMessage({
        someServiceError: deleteCurrentUserState.taskError,
      })
      setPageBody(<ErrorPageBody errorMessage={seasServiceErrorMessage} />)
    }
  }, [deleteCurrentUserState])
  return <UserlessPage pageBody={pageBody} />
}
