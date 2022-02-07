import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ContentListForm,
  ContentListFormProps,
} from '../components/ContentListForm'
import { LoggedInUserPage } from '../components/Page'
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
      await SeasService.createContentList({
        authToken: currentUser!.authToken,
        contentListFormData: contentListFormState,
      })
    }
  )
  useEffect(() => {
    if (createContentListState.taskStatus === 'taskSuccessful') {
      navigateToPage(`/${currentUser!.id}`)
    }
  }, [createContentListState])
  return (
    <LoggedInUserPage
      currentUser={currentUser!}
      pageBody={
        <ContentListForm
          formTitle={'Create List'}
          submitLabel={'Publish List'}
          initialFormState={{
            contentListTitle: '',
            contentListRating: 'SAFE_FOR_WORK',
            contentListItems: [],
          }}
          submitForm={(contentListFormState) => {
            createContentList(contentListFormState)
          }}
          cancelContentListForm={() => {
            navigateToPage(`/${currentUser!.id}`)
          }}
        />
      }
    />
  )
}
