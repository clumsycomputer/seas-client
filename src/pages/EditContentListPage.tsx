import { useState } from 'react'
import { appData } from '../appData'
import { ContentListFormPage } from '../components/ContentListFormPage'
import { ContentList } from '../models/ContentList'

export function EditContentListPage() {
  const [formState, setFormState] = useState<
    Pick<
      ContentList,
      'contentListTitle' | 'contentListRating' | 'contentListItems'
    >
  >(appData.contentLists['aaa'])
  return (
    <ContentListFormPage
      formTitle={'Edit List'}
      formState={formState}
      setFormState={setFormState}
      formActions={[
        {
          disabled: false,
          buttonLabel: '✓ Update List',
          onClick: () => {},
        },
        {
          disabled: false,
          buttonLabel: '- Delete List',
          onClick: () => {},
        },
        {
          disabled: false,
          buttonLabel: '✕ Cancel Changes',
          onClick: () => {},
        },
      ]}
    />
  )
}
