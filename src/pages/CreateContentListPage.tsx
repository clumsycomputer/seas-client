import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ContentListForm } from '../components/ContentListForm'
import { UserPage } from '../components/Page'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useTask } from '../hooks/useTask'
import { ContentListFormData } from '../models/ContentList'
import { SeasService } from '../services/SeasService'

export function CreateContentListPage() {
  const currentUser = useCurrentUser()
  const navigateToPage = useNavigate()
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
    if (currentUser && createContentListState.taskStatus === 'taskSuccessful') {
      navigateToPage(`/content-list/${createContentListState.taskResult.id}`)
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
            if (currentUser) {
              navigateToPage(`/${currentUser.id}`, {
                replace: true,
              })
            }
          }}
        />
      }
    />
  )
}
