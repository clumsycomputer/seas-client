import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ContentListForm } from '../components/ContentListForm'
import { UserPage } from '../components/Page'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useTask } from '../hooks/useTask'
import { ContentListFormData } from '../models/ContentList'
import { SeasService } from '../services/SeasService'

export function CreateContentListPage() {
  const currentUser = useCurrentUser()
  const navigateToPage = useNavigate()
  const routeParams = useParams()
  const [createContentListState, createContentList] = useTask(
    async (contentListFormData: ContentListFormData) => {
      if (currentUser) {
        const createdContentList = await SeasService.createContentList({
          contentListFormData,
          apiToken: currentUser.apiToken,
        })
        return createdContentList
      } else {
        throw new Error('wtf? createContentListTask')
      }
    }
  )
  useEffect(() => {
    if (
      routeParams.username &&
      createContentListState.taskStatus === 'taskSuccessful'
    ) {
      navigateToPage(
        `/${routeParams.username}/${createContentListState.taskResult.contentListTitle}`
      )
    }
  }, [createContentListState])
  return (
    <UserPage
      currentUser={currentUser}
      pageBody={
        <ContentListForm
          formTitle={'Create List'}
          submitLabel={'Publish List'}
          initialFieldValues={{
            contentListTitle: '',
            contentListRating: 'SAFE_FOR_WORK',
            contentListItems: [],
          }}
          submitFormState={createContentListState}
          submitForm={(contentListFormState) => {
            createContentList(contentListFormState)
          }}
          cancelContentListForm={() => {
            if (routeParams.username) {
              navigateToPage(`/${routeParams.username}`, {
                replace: true,
              })
            }
          }}
        />
      }
    />
  )
}
