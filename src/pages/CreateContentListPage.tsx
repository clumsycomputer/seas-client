import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ContentListFormPage } from '../components/ContentListFormPage'
import { ContentList } from '../models/ContentList'

export function CreateContentListPage() {
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
            fetch(`http://localhost:8000/content-list/`, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Token ${window.localStorage.getItem(
                  'auth-token'
                )}`,
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
              .then((createContentListResponseData: any) => {
                navigateSite(
                  `../content-list/${createContentListResponseData.id}`
                )
              })
          },
        },
        {
          disabled: false,
          buttonLabel: '✕ Cancel',
          onClick: () => {},
        },
      ]}
    />
  )
}
