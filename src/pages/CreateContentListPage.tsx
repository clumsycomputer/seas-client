import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ContentListForm,
  ContentListFormProps,
} from '../components/ContentListForm'
import { UserPage } from '../components/Page'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useTask } from '../hooks/useTask'
import { SeasService } from '../services/SeasService'

export function CreateContentListPage() {
  const currentUser = useCurrentUser()
  const navigateToPage = useNavigate()
  const [createContentListState, createContentList] = useTask(
    async (
      contentListFormState: Parameters<ContentListFormProps['submitForm']>[0]
    ) => {
      if (currentUser) {
        const createdContentList = await SeasService.createContentList({
          authToken: currentUser.authToken,
          contentListFormData: contentListFormState,
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
          initialFormState={{
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
