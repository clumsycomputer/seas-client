import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ContentListForm } from '../components/ContentListForm'
import { LoggedInUserPage } from '../components/Page'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { ContentList } from '../models/ContentList'
import { getContentList, updateContentList } from '../services/SeasService'

export function EditContentListPage() {
  const currentUser = useCurrentUser()
  const routeParams = useParams()
  const navigateToPage = useNavigate()
  const [contentListState, setContentListState] = useState<
    | { status: 'loading' }
    | {
        status: 'success'
        contentList: ContentList
      }
  >({
    status: 'loading',
  })
  useEffect(() => {
    getContentList({
      contentListId: routeParams.contentListId!,
    }).then((initialContentList) => {
      setContentListState({
        status: 'success',
        contentList: initialContentList,
      })
    })
  }, [])
  return contentListState.status === 'success' ? (
    <LoggedInUserPage
      currentUser={currentUser!}
      pageBody={
        <ContentListForm
          currentUser={currentUser!}
          initialFormState={contentListState.contentList}
          formTitle={'Edit List'}
          submitLabel={'Update List'}
          submitForm={(contentListFormState) => {
            updateContentList({
              authToken: currentUser!.authToken,
              contentListId: contentListState.contentList.id,
              contentListFormData: contentListFormState,
            }).then((updateContentList) => {
              navigateToPage(`/content-list/${updateContentList.id}`)
            })
          }}
        />
      }
    />
  ) : (
    <div>Loading...</div>
  )
}
