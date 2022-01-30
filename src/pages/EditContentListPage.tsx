import { Fragment, ReactNode, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ContentListFormPage } from '../components/ContentListFormPage'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { ContentList } from '../models/ContentList'

export function EditContentListPage() {
  const currentUser = useCurrentUser()
  const routeParams = useParams()
  const navigateSite = useNavigate()
  const [formState, setFormState] = useState<Pick<
    ContentList,
    'contentListTitle' | 'contentListRating' | 'contentListItems'
  > | null>(null)
  const [pageContent, setPageContent] = useState<ReactNode>(
    <div>Loading...</div>
  )
  useEffect(() => {
    fetch(`http://localhost:8000/content-lists/${routeParams.contentListId}`)
      .then((getContentListResponse) => getContentListResponse.json())
      .then((contentListResponseData: unknown) => {
        const contentList = contentListResponseData as ContentList
        setFormState(contentList)
      })
  }, [])
  useEffect(() => {
    if (formState !== null) {
      setPageContent(
        <ContentListFormPage
          formTitle={'Edit List'}
          formState={formState}
          setFormState={setFormState as any}
          formActions={[
            {
              disabled: false,
              buttonLabel: '✓ Update List',
              onClick: () => {
                fetch(
                  `http://localhost:8000/content-lists/${routeParams.contentListId}/`,
                  {
                    method: 'PUT',
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
                  }
                )
                  .then((editContentListResponse) =>
                    editContentListResponse.json()
                  )
                  .then((editContentListResponseData: unknown) => {
                    const updatedContentListData =
                      editContentListResponseData as ContentList
                    navigateSite(`/content-list/${updatedContentListData.id}`)
                  })
              },
            },
            {
              disabled: false,
              buttonLabel: '- Delete List',
              onClick: () => {
                fetch(
                  `http://localhost:8000/content-lists/${routeParams.contentListId}/`,
                  {
                    method: 'DELETE',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                      Authorization: `Token ${currentUser?.authToken}`,
                    },
                  }
                ).then(() => {
                  navigateSite(`/user/${currentUser?.id}`)
                })
              },
            },
            {
              disabled: false,
              buttonLabel: '✕ Cancel',
              onClick: () => {
                navigateSite(`/content-list/${routeParams.contentListId}`)
              },
            },
          ]}
        />
      )
    }
  }, [formState])
  return <Fragment>{pageContent}</Fragment>
}
