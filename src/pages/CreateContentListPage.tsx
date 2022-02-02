import { CloseRounded, MoreVert } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  ListItem,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Link,
  List,
  Container,
} from '@mui/material'
import { Fragment, ReactNode, useState } from 'react'
import { MenuButton } from '../components/MenuButton'
import { LoggedInUserPage } from '../components/Page'
import { useCurrentUser } from '../hooks/useCurrentUser'
import {
  ContentItem,
  ContentList,
  ContentListRating,
} from '../models/ContentList'
import { createContentList } from '../services/SeasService'

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
  const [contentItemFormDialogState, setContentItemFormDialogState] = useState<
    | {
        dialogOpen: false
      }
    | {
        dialogOpen: true
        initialFormState: ContentItem
        submitFormLabel: string
        updateContentList: (someContentItem: ContentItem) => void
      }
  >({
    dialogOpen: false,
  })
  return (
    <LoggedInUserPage
      currentUser={currentUser!}
      pageBody={
        <FormDisplay
          formTitle={'Content List'}
          cancelDialogFormAction={null}
          formContent={
            <Fragment>
              <TextField
                variant={'standard'}
                label={'Title'}
                value={formState.contentListTitle}
                onChange={(changeEvent) => {
                  setFormState({
                    ...formState,
                    contentListTitle: changeEvent.target.value,
                  })
                }}
              />
              <FormControl variant={'standard'} sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>Content Rating</InputLabel>
                <Select
                  value={formState.contentListRating}
                  onChange={(changeEvent) => {
                    setFormState({
                      ...formState,
                      contentListRating: changeEvent.target
                        .value as ContentListRating,
                    })
                  }}
                  label={'Content Rating'}
                >
                  <MenuItem value={'SAFE_FOR_WORK'}>Safe for Work</MenuItem>
                  <MenuItem value={'NOT_SAFE_FOR_WORK'}>
                    Not Safe for Work (NSFW)
                  </MenuItem>
                </Select>
              </FormControl>
              {formState.contentListItems.length > 0 ? (
                <List>
                  {formState.contentListItems.map(
                    (someContentItem, contentItemIndex) => {
                      return (
                        <ListItem
                          secondaryAction={
                            <Box>
                              <MenuButton
                                buttonColor={'default'}
                                buttonIcon={<MoreVert />}
                                menuItems={[
                                  <MenuItem
                                    key={'edit-content-item'}
                                    onClick={() => {
                                      setContentItemFormDialogState({
                                        dialogOpen: true,
                                        submitFormLabel: 'Update Item',
                                        initialFormState: someContentItem,
                                        updateContentList: (
                                          updatedContentItem
                                        ) => {
                                          const nextContentListItems = [
                                            ...formState.contentListItems,
                                          ]
                                          nextContentListItems.splice(
                                            contentItemIndex,
                                            1,
                                            updatedContentItem
                                          )
                                          setFormState({
                                            ...formState,
                                            contentListItems:
                                              nextContentListItems,
                                          })
                                          setContentItemFormDialogState({
                                            dialogOpen: false,
                                          })
                                        },
                                      })
                                    }}
                                  >
                                    Edit Item
                                  </MenuItem>,
                                  <MenuItem
                                    key={'remove-content-item'}
                                    onClick={() => {
                                      const nextContentListItems = [
                                        ...formState.contentListItems,
                                      ]
                                      nextContentListItems.splice(
                                        contentItemIndex,
                                        1
                                      )
                                      setFormState({
                                        ...formState,
                                        contentListItems: nextContentListItems,
                                      })
                                    }}
                                  >
                                    Remove Item
                                  </MenuItem>,
                                  <MenuItem
                                    key={'move-content-item-up'}
                                    onClick={() => {
                                      const nextContentListItems = [
                                        ...formState.contentListItems,
                                      ]
                                      nextContentListItems.splice(
                                        contentItemIndex - 1,
                                        0,
                                        nextContentListItems.splice(
                                          contentItemIndex,
                                          1
                                        )[0]
                                      )
                                      setFormState({
                                        ...formState,
                                        contentListItems: nextContentListItems,
                                      })
                                    }}
                                  >
                                    Move Item Up
                                  </MenuItem>,
                                  <MenuItem
                                    key={'move-content-item-down'}
                                    onClick={() => {
                                      const nextContentListItems = [
                                        ...formState.contentListItems,
                                      ]
                                      nextContentListItems.splice(
                                        contentItemIndex + 1,
                                        0,
                                        nextContentListItems.splice(
                                          contentItemIndex,
                                          1
                                        )[0]
                                      )
                                      setFormState({
                                        ...formState,
                                        contentListItems: nextContentListItems,
                                      })
                                    }}
                                  >
                                    Move Item Down
                                  </MenuItem>,
                                ]}
                              />
                            </Box>
                          }
                        >
                          <Stack>
                            <Box>
                              <Typography
                                variant={'subtitle2'}
                                fontWeight={600}
                              >
                                {someContentItem.contentItemTitle}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant={'body2'} fontWeight={500}>
                                {someContentItem.contentItemAuthor}
                              </Typography>
                            </Box>
                            <Stack>
                              {someContentItem.contentItemLinks.map(
                                (someContentLink, contentLinkIndex) => {
                                  return (
                                    <Box key={`${contentLinkIndex}`}>
                                      <Link
                                        href={someContentLink.contentLinkUrl}
                                      >
                                        <Typography
                                          variant={'body2'}
                                          fontWeight={500}
                                        >
                                          {someContentLink.contentLinkHostName}
                                        </Typography>
                                      </Link>
                                    </Box>
                                  )
                                }
                              )}
                            </Stack>
                          </Stack>
                        </ListItem>
                      )
                    }
                  )}
                </List>
              ) : (
                <Box
                  display={'flex'}
                  flexDirection={'row'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  paddingTop={1}
                >
                  <Typography variant={'body2'} color={'GrayText'}>
                    No Content Items
                  </Typography>
                </Box>
              )}
              <Box display={'flex'} flexDirection={'row'}>
                <Button
                  sx={{ flexGrow: 1 }}
                  variant={'outlined'}
                  onClick={() => {
                    setContentItemFormDialogState({
                      dialogOpen: true,
                      submitFormLabel: 'Add Item',
                      initialFormState: {
                        contentItemTitle: '',
                        contentItemAuthor: '',
                        contentItemLinks: [
                          {
                            contentLinkHostName: '',
                            contentLinkUrl: '',
                          },
                        ],
                      },
                      updateContentList: (newContentItem) => {
                        setFormState({
                          ...formState,
                          contentListItems: [
                            ...formState.contentListItems,
                            newContentItem,
                          ],
                        })
                        setContentItemFormDialogState({
                          dialogOpen: false,
                        })
                      },
                    })
                  }}
                >
                  Add Item
                </Button>
              </Box>
              <Dialog
                fullWidth={true}
                open={contentItemFormDialogState.dialogOpen}
                onClose={() => {
                  setContentItemFormDialogState({
                    dialogOpen: false,
                  })
                }}
              >
                {contentItemFormDialogState.dialogOpen ? (
                  <ContentItemForm
                    initialFormState={
                      contentItemFormDialogState.initialFormState
                    }
                    submitFormLabel={contentItemFormDialogState.submitFormLabel}
                    cancelContentItemForm={() => {
                      setContentItemFormDialogState({
                        dialogOpen: false,
                      })
                    }}
                    updateContentList={
                      contentItemFormDialogState.updateContentList
                    }
                  />
                ) : null}
              </Dialog>
            </Fragment>
          }
          formActions={
            <Button
              variant={'contained'}
              onClick={() => {
                createContentList({
                  authToken: currentUser!.authToken,
                  contentListFormData: formState,
                })
              }}
            >
              Publish List
            </Button>
          }
        />
      }
    />
  )
}

interface ContentItemFormProps {
  initialFormState: ContentItem
  cancelContentItemForm: () => void
  updateContentList: (someContentItem: ContentItem) => void
  submitFormLabel: string
}

function ContentItemForm(props: ContentItemFormProps) {
  const {
    initialFormState,
    cancelContentItemForm,
    updateContentList,
    submitFormLabel,
  } = props
  const [formState, setFormState] = useState<ContentItem>(initialFormState)
  return (
    <FormDisplay
      formTitle={'Content Item'}
      cancelDialogFormAction={
        <IconButton
          onClick={() => {
            cancelContentItemForm()
          }}
        >
          <CloseRounded />
        </IconButton>
      }
      formContent={
        <Fragment>
          <TextField
            variant={'standard'}
            label={'Title'}
            value={formState.contentItemTitle}
            onChange={(changeEvent) => {
              setFormState({
                ...formState,
                contentItemTitle: changeEvent.target.value,
              })
            }}
          />
          <TextField
            variant={'standard'}
            label={'Author'}
            value={formState.contentItemAuthor}
            onChange={(changeEvent) => {
              setFormState({
                ...formState,
                contentItemAuthor: changeEvent.target.value,
              })
            }}
          />
          <TextField
            variant={'standard'}
            label={'Host Name'}
            value={formState.contentItemLinks[0].contentLinkHostName}
            onChange={(changeEvent) => {
              setFormState({
                ...formState,
                contentItemLinks: [
                  {
                    ...formState.contentItemLinks[0],
                    contentLinkHostName: changeEvent.target.value,
                  },
                ],
              })
            }}
          />
          <TextField
            variant={'standard'}
            label={'Url'}
            value={formState.contentItemLinks[0].contentLinkUrl}
            onChange={(changeEvent) => {
              setFormState({
                ...formState,
                contentItemLinks: [
                  {
                    ...formState.contentItemLinks[0],
                    contentLinkUrl: changeEvent.target.value,
                  },
                ],
              })
            }}
          />
        </Fragment>
      }
      formActions={
        <Button
          variant={'contained'}
          onClick={() => {
            updateContentList(formState)
          }}
        >
          {submitFormLabel}
        </Button>
      }
    />
  )
}

interface FormDisplayProps {
  formTitle: string
  cancelDialogFormAction: ReactNode
  formContent: ReactNode
  formActions: ReactNode
}

function FormDisplay(props: FormDisplayProps) {
  const { formTitle, cancelDialogFormAction, formContent, formActions } = props
  return (
    <Stack padding={2} spacing={2}>
      <Stack spacing={1 / 2}>
        <Box display={'flex'} flexDirection={'row'} alignItems={'flex-end'}>
          <Typography variant={'h6'}>{formTitle}</Typography>
          <Box flexGrow={1} />
          {cancelDialogFormAction}
        </Box>
        <Divider sx={{ borderBottomWidth: 2 }} />
      </Stack>
      <Stack spacing={3}>{formContent}</Stack>
      <Box
        display={'flex'}
        flexDirection={'row-reverse'}
        paddingTop={3}
        paddingBottom={1}
      >
        {formActions}
      </Box>
    </Stack>
  )
}
