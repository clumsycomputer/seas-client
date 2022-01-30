import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ContentListFormPage } from '../components/ContentListFormPage'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { ContentList } from '../models/ContentList'

export function CreateContentListPage() {
  const currentUser = useCurrentUser()
  const [formState, setFormState] = useState<
    Pick<
      ContentList,
      'contentListTitle' | 'contentListRating' | 'contentListItems'
    >
  >({
    contentListTitle: '',
    contentListRating: 'SAFE_FOR_WORK',
    contentListItems: [],
  })
  const navigateSite = useNavigate()
  return (
    <ContentListFormPage
      formTitle={'Create List'}
      formState={formState}
      setFormState={setFormState}
      formActions={[
        {
          disabled: false,
          buttonLabel: '✓ Publish List',
          onClick: () => {
            fetch(`http://localhost:8000/content-lists/`, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Token ${currentUser?.authToken}`,
              },
              body: JSON.stringify({
                contentListTitle: formState.contentListTitle,
                contentListRating: formState.contentListRating,
                contentListItems: formState.contentListItems,
              }),
            })
              .then((createContentListResponse) =>
                createContentListResponse.json()
              )
              .then((createContentListResponseData: unknown) => {
                const createdContentListData =
                  createContentListResponseData as ContentList
                navigateSite(`/content-list/${createdContentListData.id}`)
              })
          },
        },
        {
          disabled: false,
          buttonLabel: '✕ Cancel',
          onClick: () => {
            navigateSite(`/user/${currentUser?.id}`)
          },
        },
      ]}
    />
  )
}
