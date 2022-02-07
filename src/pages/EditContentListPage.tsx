import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ContentListForm } from '../components/ContentListForm'
import { LoggedInUserPage } from '../components/Page'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useTask } from '../hooks/useTask'
import { ContentList } from '../models/ContentList'
import { SeasService } from '../services/SeasService'

export function EditContentListPage() {
  const currentUser = useCurrentUser()
  const routeParams = useParams()
  const navigateToPage = useNavigate()
  const [pageBody, setPageBody] = useState<ReactNode>(null)
  const [getInitialContentListState, getInitialContentList] = useTask(
    async () => {
      const getContentListData: unknown = await SeasService.getContentList({
        contentListId: routeParams.contentListId!,
      })
      const contentList = getContentListData as ContentList
      return contentList
    }
  )
  const [updateContentListState, updateContentList] = useTask(
    async (contentListFormData) => {
      if (getInitialContentListState.taskStatus === 'taskSuccessful') {
        const initialContentList = getInitialContentListState.taskResult
        await SeasService.updateContentList({
          authToken: currentUser!.authToken,
          contentListId: initialContentList.id,
          contentListFormData: contentListFormData,
        })
      }
    }
  )
  useEffect(() => {
    getInitialContentList()
  }, [])
  useEffect(() => {
    if (updateContentListState.taskStatus === 'taskSuccessful') {
      navigateToPage(`/content-list/${routeParams.contentListId!}`)
    }
  }, [updateContentListState])
  const cancelRedirectionRoute = useMemo(() => {
    const currentSearchParams = new URLSearchParams(window.location.search)
    const cancelRidirectionRoute = currentSearchParams.get('cancel-route')
    return cancelRidirectionRoute || `/${currentUser!.id}`
  }, [])
  useEffect(() => {
    if (getInitialContentListState.taskStatus === 'taskSuccessful') {
      const initialContentList = getInitialContentListState.taskResult
      setPageBody(
        <ContentListForm
          initialFormState={initialContentList}
          formTitle={'Edit List'}
          submitLabel={'Update List'}
          submitForm={(contentListFormData) => {
            updateContentList(contentListFormData)
          }}
          cancelContentListForm={() => {
            navigateToPage(cancelRedirectionRoute)
          }}
        />
      )
    }
  }, [getInitialContentListState])
  return <LoggedInUserPage currentUser={currentUser!} pageBody={pageBody} />
}
