import { useNavigate } from 'react-router-dom'
import { ContentListForm } from '../components/ContentListForm'
import { LoggedInUserPage } from '../components/Page'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { createContentList } from '../services/SeasService'

export function CreateContentListPage() {
  const currentUser = useCurrentUser()
  const navigateToPage = useNavigate()
  return (
    <LoggedInUserPage
      currentUser={currentUser!}
      pageBody={
        <ContentListForm
          currentUser={currentUser!}
          formTitle={'Create List'}
          submitLabel={'Publish List'}
          initialFormState={{
            contentListTitle: '',
            contentListRating: 'SAFE_FOR_WORK',
            contentListItems: [],
          }}
          submitForm={(contentListFormState) => {
            createContentList({
              authToken: currentUser!.authToken,
              contentListFormData: contentListFormState,
            }).then(() => {
              navigateToPage(`/${currentUser!.id}`)
            })
          }}
        />
      }
    />
  )
}
