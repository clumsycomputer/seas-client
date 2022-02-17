import { ReactNode, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ContentListForm } from '../components/ContentListForm'
import { LoadingPageBody } from '../components/LoadingPageBody'
import { UserPage } from '../components/Page'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useTask } from '../hooks/useTask'
import { ContentListFormData } from '../models/ContentList'
import { SeasService } from '../services/SeasService'

export function EditContentListPage() {
  const currentUser = useCurrentUser()
  const routeParams = useParams()
  const navigateToPage = useNavigate()
  const [getInitialContentListState, getInitialContentList] = useTask(
    async () => {
      if (routeParams.contentListTitle) {
        const initialContentList = await SeasService.getContentList({
          contentListTitle: routeParams.contentListTitle,
        })
        return initialContentList
      } else {
        throw new Error('wtf? getInitialContentListState')
      }
    }
  )
  const [updateContentListState, updateContentList] = useTask(
    async (contentListFormData: ContentListFormData) => {
      if (
        currentUser &&
        getInitialContentListState.taskStatus === 'taskSuccessful'
      ) {
        const initialContentList = getInitialContentListState.taskResult
        const updatedContentList = await SeasService.updateContentList({
          apiToken: currentUser.apiToken,
          contentListTitle: initialContentList.contentListTitle,
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
    if (
      routeParams.username &&
      updateContentListState.taskStatus === 'taskSuccessful'
    ) {
      navigateToPage(
        `/${routeParams.username}/${updateContentListState.taskResult.contentListTitle}`,
        {
          replace: true,
        }
      )
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
          initialFieldValues={{
            contentListTitle:
              getInitialContentListState.taskResult.contentListTitle,
            contentListRating:
              getInitialContentListState.taskResult.contentListRating,
            contentListItems:
              getInitialContentListState.taskResult.contentListItems,
          }}
          formTitle={'Edit List'}
          submitLabel={'Update List'}
          submitFormState={updateContentListState}
          submitForm={(contentListFormData) => {
            updateContentList(contentListFormData)
          }}
          cancelContentListForm={() => {
            if (routeParams.username) {
              const currentSearchParams = new URLSearchParams(
                window.location.search
              )
              const cancelRidirectionRoute =
                currentSearchParams.get('cancel-route')
              navigateToPage(
                cancelRidirectionRoute || `/${routeParams.username}`,
                {
                  replace: true,
                }
              )
            }
          }}
        />
      )
    } else {
      setPageBody(<LoadingPageBody />)
    }
  }, [getInitialContentListState, updateContentListState])
  return <UserPage currentUser={currentUser} pageBody={pageBody} />
}
