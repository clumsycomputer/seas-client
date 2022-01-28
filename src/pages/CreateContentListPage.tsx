import { useState } from 'react'
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
    contentListRating: 'safeForWork',
    contentListItems: [],
  })
  return (
    <ContentListFormPage
      formTitle={'Create List'}
      formState={formState}
      setFormState={setFormState}
      formActions={[
        {
          disabled: false,
          buttonLabel: '✓ Publish List',
          onClick: () => {},
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
