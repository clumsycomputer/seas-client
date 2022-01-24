import { useState } from 'react'
import { createUseStyles } from 'react-jss'
import { AppTheme } from '../appTheme'
import { PageContainer } from '../components/PageContainer'
import { TextLabel } from '../components/TextLabel'
import { ContentList } from '../models/ContentList'

export function CreateContentListPage() {
  const styles = useStyles()
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
    <PageContainer>
      <div className={styles.formTitle}>Create Content List</div>
      <div className={styles.formDivider} />
      <form className={styles.formInputsContainer}>
        <div>
          <div>Content List Title</div>
          <input
            type={'text'}
            value={formState.contentListTitle}
            onChange={(someChangeEvent) => {
              setFormState({
                ...formState,
                contentListTitle: someChangeEvent.target.value,
              })
            }}
          />
        </div>
        <div>
          <div>Content List Rating</div>
          <div className={styles.contentListRatingInputContainer}>
            <div>nsfw: </div>
            <input
              type={'checkbox'}
              checked={formState.contentListRating === 'notSafeForWork'}
              onChange={(someChangeEvent) => {
                setFormState({
                  ...formState,
                  contentListRating:
                    someChangeEvent.target.checked === true
                      ? 'notSafeForWork'
                      : 'safeForWork',
                })
              }}
            />
          </div>
        </div>
        {formState.contentListItems.map((someContentItem, contentItemIndex) => {
          return (
            <div className={styles.contentItemContainer}>
              <div className={styles.contentItemDivider} />
              <div>
                <div>Content Title</div>
                <input
                  type={'text'}
                  value={someContentItem.contentTitle}
                  onChange={(someChangeEvent) => {
                    const nextContentListItems = [...formState.contentListItems]
                    nextContentListItems.splice(contentItemIndex, 1, {
                      ...someContentItem,
                      contentTitle: someChangeEvent.target.value,
                    })
                    setFormState({
                      ...formState,
                      contentListItems: nextContentListItems,
                    })
                  }}
                />
              </div>
              <div>
                <div>Content Producer</div>
                <input
                  type={'text'}
                  value={someContentItem.contentProducer}
                  onChange={(someChangeEvent) => {
                    const nextContentListItems = [...formState.contentListItems]
                    nextContentListItems.splice(contentItemIndex, 1, {
                      ...someContentItem,
                      contentProducer: someChangeEvent.target.value,
                    })
                    setFormState({
                      ...formState,
                      contentListItems: nextContentListItems,
                    })
                  }}
                />
              </div>
              {someContentItem.contentLinks.map((someContentLink) => {
                return (
                  <div style={{ padding: 8 }}>
                    <div className={styles.contentItemDivider} />
                    <div>
                      <div>Content Host Name</div>
                      <input
                        type={'text'}
                        value={someContentLink.contentHostName}
                        onChange={(someChangeEvent) => {
                          const nextContentListItems = [
                            ...formState.contentListItems,
                          ]
                          nextContentListItems.splice(contentItemIndex, 1, {
                            ...someContentItem,
                            contentProducer: someChangeEvent.target.value,
                          })
                          setFormState({
                            ...formState,
                            contentListItems: nextContentListItems,
                          })
                        }}
                      />
                    </div>
                    <div>
                      <div>Content Href</div>
                      <input
                        type={'url'}
                        value={someContentLink.contentHref}
                        onChange={(someChangeEvent) => {
                          const nextContentListItems = [
                            ...formState.contentListItems,
                          ]
                          nextContentListItems.splice(contentItemIndex, 1, {
                            ...someContentItem,
                            contentProducer: someChangeEvent.target.value,
                          })
                          setFormState({
                            ...formState,
                            contentListItems: nextContentListItems,
                          })
                        }}
                      />
                    </div>
                  </div>
                )
              })}
              <button
                type={'button'}
                onClick={() => {
                  const nextContentListItems = [...formState.contentListItems]
                  nextContentListItems.splice(contentItemIndex, 1, {
                    ...someContentItem,
                    contentLinks: [
                      ...someContentItem.contentLinks,
                      {
                        contentHostName: '',
                        contentHref: '',
                      },
                    ],
                  })
                  setFormState({
                    ...formState,
                    contentListItems: nextContentListItems,
                  })
                }}
              >
                + Add Content Link
              </button>
              <button
                type={'button'}
                disabled={contentItemIndex === 0}
                onClick={() => {
                  const nextContentListItems = [...formState.contentListItems]
                  nextContentListItems.splice(
                    contentItemIndex - 1,
                    0,
                    nextContentListItems.splice(contentItemIndex, 1)[0]
                  )
                  setFormState({
                    ...formState,
                    contentListItems: nextContentListItems,
                  })
                }}
              >
                ↑ Move Item Up
              </button>
              <button
                type={'button'}
                disabled={
                  contentItemIndex === formState.contentListItems.length - 1
                }
                onClick={() => {
                  const nextContentListItems = [...formState.contentListItems]
                  nextContentListItems.splice(
                    contentItemIndex + 1,
                    0,
                    nextContentListItems.splice(contentItemIndex, 1)[0]
                  )
                  setFormState({
                    ...formState,
                    contentListItems: nextContentListItems,
                  })
                }}
              >
                ↓ Move Item Down
              </button>
              <button
                type={'button'}
                onClick={() => {
                  const nextContentListItems = [...formState.contentListItems]
                  nextContentListItems.splice(contentItemIndex, 1)
                  setFormState({
                    ...formState,
                    contentListItems: nextContentListItems,
                  })
                }}
              >
                - Remove Item
              </button>
            </div>
          )
        })}
        <button
          type={'button'}
          onClick={() => {
            setFormState({
              ...formState,
              contentListItems: [
                ...formState.contentListItems,
                {
                  contentTitle: '',
                  contentProducer: '',
                  contentLinks: [],
                },
              ],
            })
          }}
        >
          + Add Content Item
        </button>
        <div className={styles.formDivider} />
        <button type={'submit'}>Publish</button>
      </form>
    </PageContainer>
  )
}

const useStyles = createUseStyles((appTheme: AppTheme) => {
  return {
    formTitle: {
      fontSize: 20,
      fontWeight: 600,
    },
    formDivider: {
      height: 2,
      backgroundColor: appTheme.palette.lightGray,
      borderRadius: 2,
    },
    formInputsContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    contentListRatingInputContainer: {
      display: 'flex',
      flexDirection: 'row',
    },
    contentItemContainer: {
      paddingTop: appTheme.spacing(2),
      paddingLeft: appTheme.spacing(1),
    },
    contentItemDivider: {
      height: 2,
      backgroundColor: appTheme.palette.lightGray,
      borderRadius: 2,
    },
  }
})
