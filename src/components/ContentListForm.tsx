import { CloseRounded, MoreVert } from '@mui/icons-material'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  Link,
  List,
  ListItem,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Fragment, ReactNode, useState } from 'react'
import { TaskState } from '../hooks/useTask'
import {
  ContentItem,
  ContentList,
  ContentListRating,
} from '../models/ContentList'
import { MenuButton } from './MenuButton'

export interface ContentListFormProps {
  formTitle: string
  submitLabel: string
  initialFormState: Pick<
    ContentList,
    'contentListTitle' | 'contentListRating' | 'contentListItems'
  >
  submitFormState: TaskState<ContentList>
  submitForm: (
    formState: Pick<
      ContentList,
      'contentListTitle' | 'contentListRating' | 'contentListItems'
    >
  ) => void
  cancelContentListForm: () => void
}

export function ContentListForm(props: ContentListFormProps) {
  const {
    initialFormState,
    formTitle,
    cancelContentListForm,
    submitLabel,
    submitFormState,
    submitForm,
  } = props
  const [formState, setFormState] =
    useState<ContentListFormProps['initialFormState']>(initialFormState)
  const [contentItemFormDialogState, setContentItemFormDialogState] = useState<
    | {
        dialogOpen: false
      }
    | ({
        dialogOpen: true
      } & Pick<
        ContentItemFormProps,
        'formTitle' | 'submitLabel' | 'updateContentList' | 'initialFormState'
      >)
  >({
    dialogOpen: false,
  })
  return (
    <FormDisplay
      formTitle={formTitle}
      cancelDialogFormAction={
        <IconButton
          onClick={() => {
            cancelContentListForm()
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
          <List>
            {formState.contentListItems.length > 0 ? (
              formState.contentListItems.map(
                (someContentItem, contentItemIndex) => {
                  return (
                    <ListItem
                      secondaryAction={
                        <Box>
                          <MenuButton
                            buttonColor={'default'}
                            buttonIcon={<MoreVert />}
                            menuItems={[
                              {
                                children: 'Edit Item',
                                onClick: () => {
                                  setContentItemFormDialogState({
                                    dialogOpen: true,
                                    formTitle: 'Edit Content Item',
                                    submitLabel: 'Update Item',
                                    initialFormState: someContentItem,
                                    updateContentList: (updatedContentItem) => {
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
                                        contentListItems: nextContentListItems,
                                      })
                                      setContentItemFormDialogState({
                                        dialogOpen: false,
                                      })
                                    },
                                  })
                                },
                              },
                              {
                                children: 'Remove Item',
                                onClick: () => {
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
                                },
                              },
                              {
                                children: 'Move Item Up',
                                disabled: contentItemIndex === 0,
                                onClick: () => {
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
                                },
                              },
                              {
                                children: 'Move Item Down',
                                disabled:
                                  contentItemIndex ===
                                  formState.contentListItems.length - 1,
                                onClick: () => {
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
                                },
                              },
                            ]}
                          />
                        </Box>
                      }
                    >
                      <Stack>
                        <Box>
                          <Typography variant={'subtitle2'} fontWeight={600}>
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
                                  <Link href={someContentLink.contentLinkUrl}>
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
              )
            ) : (
              <ListItem>
                <Box
                  flexGrow={1}
                  display={'flex'}
                  flexDirection={'row'}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <Typography
                    variant={'subtitle2'}
                    color={'GrayText'}
                    fontSize={14}
                    fontStyle={'italic'}
                  >
                    No Content Items
                  </Typography>
                </Box>
              </ListItem>
            )}
          </List>
          <Box display={'flex'} flexDirection={'row'}>
            <Button
              sx={{ flexGrow: 1 }}
              variant={'outlined'}
              onClick={() => {
                setContentItemFormDialogState({
                  dialogOpen: true,
                  formTitle: 'Create Item',
                  submitLabel: 'Add Item',
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
                formTitle={contentItemFormDialogState.formTitle}
                submitLabel={contentItemFormDialogState.submitLabel}
                initialFormState={contentItemFormDialogState.initialFormState}
                cancelContentItemForm={() => {
                  setContentItemFormDialogState({
                    dialogOpen: false,
                  })
                }}
                updateContentList={contentItemFormDialogState.updateContentList}
              />
            ) : null}
          </Dialog>
        </Fragment>
      }
      formActions={
        <Fragment>
          <Button
            disabled={submitFormState.taskStatus === 'taskActive'}
            variant={'contained'}
            onClick={() => {
              submitForm(formState)
            }}
          >
            <Box display={'relative'}>
              {submitLabel}
              {submitFormState.taskStatus === 'taskActive' ? (
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              ) : null}
            </Box>
          </Button>
        </Fragment>
      }
    />
  )
}

interface ContentItemFormProps {
  formTitle: string
  submitLabel: string
  initialFormState: ContentItem
  cancelContentItemForm: () => void
  updateContentList: (someContentItem: ContentItem) => void
}

function ContentItemForm(props: ContentItemFormProps) {
  const {
    formTitle,
    initialFormState,
    cancelContentItemForm,
    updateContentList,
    submitLabel,
  } = props
  const [formState, setFormState] = useState<ContentItem>(initialFormState)
  return (
    <FormDisplay
      formTitle={formTitle}
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
          {submitLabel}
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
    <Stack padding={2} spacing={3}>
      <Stack spacing={0}>
        <Box display={'flex'} flexDirection={'row'} alignItems={'flex-end'}>
          <Typography variant={'h6'} paddingBottom={4 / 7}>
            {formTitle}
          </Typography>
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
