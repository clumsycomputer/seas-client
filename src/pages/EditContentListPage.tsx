import { ReactNode, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ContentListForm } from '../components/ContentListForm'
import { LoadingPageBody } from '../components/LoadingPageBody'
import { UserPage } from '../components/Page'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useTask } from '../hooks/useTask'
import { ContentList } from '../models/ContentList'
import { SeasService } from '../services/SeasService'

export function EditContentListPage() {
  const currentUser = useCurrentUser()
  const routeParams = useParams()
  const navigateToPage = useNavigate()
  const [getInitialContentListState, getInitialContentList] = useTask(
    async () => {
      const initialContentList = await SeasService.getContentList({
        contentListId: parseInt(routeParams.contentListId!),
      })
      return initialContentList
    }
  )
  const [updateContentListState, updateContentList] = useTask(
    async (contentListFormData) => {
      if (getInitialContentListState.taskStatus === 'taskSuccessful') {
        const initialContentList = getInitialContentListState.taskResult
        const updatedContentList = await SeasService.updateContentList({
          authToken: currentUser!.authToken,
          contentListId: initialContentList.id,
          contentListFormData: contentListFormData,
        })
        return updatedContentList
      } else {
        throw new Error('wtf? updateContentListTask')
      }
    }
  )
  useEffect(() => {
    getInitialContentList()
  }, [])
  useEffect(() => {
    if (updateContentListState.taskStatus === 'taskSuccessful') {
      navigateToPage(`/content-list/${updateContentListState.taskResult.id}`, {
        replace: true,
      })
    }
  }, [updateContentListState])
  const [pageBody, setPageBody] = useState<ReactNode>(null)
  useEffect(() => {
    if (
      currentUser &&
      getInitialContentListState.taskStatus === 'taskSuccessful'
    ) {
      setPageBody(
        <ContentListForm
          initialFormState={getInitialContentListState.taskResult}
          formTitle={'Edit List'}
          submitLabel={'Update List'}
          submitFormState={updateContentListState}
          submitForm={(contentListFormData) => {
            updateContentList(contentListFormData)
          }}
          cancelContentListForm={() => {
            const currentSearchParams = new URLSearchParams(
              window.location.search
            )
            const cancelRidirectionRoute =
              currentSearchParams.get('cancel-route')
            navigateToPage(cancelRidirectionRoute || `/${currentUser.id}`, {
              replace: true,
            })
          }}
        />
      )
    } else {
      setPageBody(<LoadingPageBody />)
    }
  }, [getInitialContentListState, updateContentListState])
  return <UserPage currentUser={currentUser} pageBody={pageBody} />
}
