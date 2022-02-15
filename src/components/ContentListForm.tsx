import { MoreVert } from '@mui/icons-material'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  FormControl,
  InputLabel,
  Link,
  List,
  ListItem,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useForm, UseFormApi } from '../hooks/useForm'
import { TaskState } from '../hooks/useTask'
import {
  ContentItem,
  ContentLink,
  ContentList,
  ContentListRating,
} from '../models/ContentList'
import { FormDisplay } from './FormDisplay'
import { SSTextField } from './FormFields'
import { MenuButton } from './MenuButton'

export interface ContentListFormProps
  extends Pick<UseFormApi<ContentListFormFields>, 'initialFieldValues'> {
  formTitle: string
  submitLabel: string
  submitFormState: TaskState<ContentList>
  submitForm: (validateFieldValues: ContentListFormFields) => void
  cancelContentListForm: () => void
}

interface ContentListFormFields
  extends Pick<
    ContentList,
    'contentListTitle' | 'contentListRating' | 'contentListItems'
  > {}

export function ContentListForm(props: ContentListFormProps) {
  const {
    initialFieldValues,
    formTitle,
    cancelContentListForm,
    submitLabel,
    submitFormState,
    submitForm,
  } = props
  const [formState, setFieldValues, validateForm] =
    useForm<ContentListFormFields>({
      initialFieldValues,
      formSchema: Yup.object({
        contentListTitle: Yup.string().required(),
        contentListRating: Yup.mixed()
          .oneOf(['SAFE_FOR_WORK', 'NOT_SAFE_FOR_WORK'])
          .required(),
        contentListItems: Yup.array(
          Yup.object({
            contentItemTitle: Yup.string().required(),
            contentItemAuthor: Yup.string().required(),
            contentItemLinks: Yup.array(
              Yup.object({
                contentLinkHostName: Yup.string().required(),
                contentLinkUrl: Yup.string().url().required(),
              })
            )
              .min(1)
              .required(),
          })
        )
          .min(1)
          .required(),
      }),
      externalFormValidationError: {
        formError: null,
        fieldErrors: {},
      },
    })
  useEffect(() => {
    if (
      formState.fieldErrors?.contentListItems === 'min' &&
      formState.fieldValues.contentListItems.length > 0
    ) {
      validateForm()
    }
  }, [formState])
  const [contentItemFormDialogState, setContentItemFormDialogState] = useState<
    | {
        dialogOpen: false
      }
    | ({
        dialogOpen: true
      } & Pick<
        ContentItemFormProps,
        'formTitle' | 'submitLabel' | 'updateContentList' | 'initialFieldValues'
      >)
  >({
    dialogOpen: false,
  })
  return (
    <FormDisplay
      formTitle={formTitle}
      formContent={
        <Fragment>
          <SSTextField
            required={true}
            label={'Title'}
            value={formState.fieldValues.contentListTitle}
            error={Boolean(formState.fieldErrors?.contentListTitle)}
            helperText={formState.fieldErrors?.contentListTitle}
            onChange={(changeEvent) => {
              setFieldValues({
                contentListTitle: changeEvent.target.value,
              })
            }}
          />
          <FormControl variant={'standard'} sx={{ m: 1, minWidth: 120 }}>
            <InputLabel required={true}>Content Rating</InputLabel>
            <Select
              value={formState.fieldValues.contentListRating}
              onChange={(changeEvent) => {
                setFieldValues({
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
            {formState.fieldValues.contentListItems.length > 0 ? (
              formState.fieldValues.contentListItems.map(
                (someContentItem, contentItemIndex) => {
                  return (
                    <ListItem
                      key={`${Math.random()}`}
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
                                    initialFieldValues: {
                                      contentItemTitle:
                                        someContentItem.contentItemTitle,
                                      contentItemAuthor:
                                        someContentItem.contentItemAuthor,
                                      contentLinkHostName:
                                        someContentItem.contentItemLinks[0]
                                          .contentLinkHostName,
                                      contentLinkUrl:
                                        someContentItem.contentItemLinks[0]
                                          .contentLinkUrl,
                                    },
                                    updateContentList: async (
                                      updatedContentItem
                                    ) => {
                                      const nextContentListItems = [
                                        ...formState.fieldValues
                                          .contentListItems,
                                      ]
                                      nextContentListItems.splice(
                                        contentItemIndex,
                                        1,
                                        updatedContentItem
                                      )
                                      setFieldValues({
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
                                    ...formState.fieldValues.contentListItems,
                                  ]
                                  nextContentListItems.splice(
                                    contentItemIndex,
                                    1
                                  )
                                  setFieldValues({
                                    contentListItems: nextContentListItems,
                                  })
                                },
                              },
                              {
                                children: 'Move Item Up',
                                disabled: contentItemIndex === 0,
                                onClick: () => {
                                  const nextContentListItems = [
                                    ...formState.fieldValues.contentListItems,
                                  ]
                                  nextContentListItems.splice(
                                    contentItemIndex - 1,
                                    0,
                                    nextContentListItems.splice(
                                      contentItemIndex,
                                      1
                                    )[0]
                                  )
                                  setFieldValues({
                                    contentListItems: nextContentListItems,
                                  })
                                },
                              },
                              {
                                children: 'Move Item Down',
                                disabled:
                                  contentItemIndex ===
                                  formState.fieldValues.contentListItems
                                    .length -
                                    1,
                                onClick: () => {
                                  const nextContentListItems = [
                                    ...formState.fieldValues.contentListItems,
                                  ]
                                  nextContentListItems.splice(
                                    contentItemIndex + 1,
                                    0,
                                    nextContentListItems.splice(
                                      contentItemIndex,
                                      1
                                    )[0]
                                  )
                                  setFieldValues({
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
                    fontSize={14}
                    fontStyle={'italic'}
                    color={
                      formState.fieldErrors?.contentListItems
                        ? 'error.main'
                        : 'GrayText'
                    }
                  >
                    No Content Items
                  </Typography>
                </Box>
              </ListItem>
            )}
          </List>
          <Box display={'flex'} flexDirection={'column'}>
            <Button
              sx={{ alignSelf: 'stretch' }}
              variant={'outlined'}
              onClick={() => {
                setContentItemFormDialogState({
                  dialogOpen: true,
                  formTitle: 'Create Item',
                  submitLabel: 'Add Item',
                  initialFieldValues: {
                    contentItemTitle: '',
                    contentItemAuthor: '',
                    contentLinkHostName: '',
                    contentLinkUrl: '',
                  },
                  updateContentList: async (newContentItem) => {
                    setFieldValues({
                      contentListItems: [
                        ...formState.fieldValues.contentListItems,
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
            <Typography
              paddingTop={1}
              alignSelf={'center'}
              visibility={
                formState.fieldErrors?.contentListItems === 'min' &&
                formState.fieldValues.contentListItems.length === 0
                  ? 'visible'
                  : 'hidden'
              }
              variant={'caption'}
              fontStyle={'italic'}
              color={'error.main'}
            >
              There must be at least one Content Item
            </Typography>
          </Box>
          <Dialog
            fullWidth={true}
            open={contentItemFormDialogState.dialogOpen}
            onClose={async () => {
              setContentItemFormDialogState({
                dialogOpen: false,
              })
            }}
          >
            {contentItemFormDialogState.dialogOpen ? (
              <ContentItemForm
                formTitle={contentItemFormDialogState.formTitle}
                submitLabel={contentItemFormDialogState.submitLabel}
                initialFieldValues={
                  contentItemFormDialogState.initialFieldValues
                }
                updateContentList={contentItemFormDialogState.updateContentList}
                cancelContentItemForm={() => {
                  setContentItemFormDialogState({
                    dialogOpen: false,
                  })
                }}
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
            onClick={async () => {
              await validateForm()
              submitForm(formState.fieldValues)
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
          <Box paddingRight={2}>
            <Button
              onClick={() => {
                cancelContentListForm()
              }}
            >
              Cancel
            </Button>
          </Box>
        </Fragment>
      }
      formError={
        submitFormState.taskStatus === 'taskError' ? (
          <Typography
            display={'flex'}
            flexDirection={'row-reverse'}
            variant={'subtitle2'}
            color={'error.main'}
          >
            Oops, something happened!
          </Typography>
        ) : null
      }
    />
  )
}

interface ContentItemFormProps
  extends Pick<UseFormApi<ContentItemFormFields>, 'initialFieldValues'> {
  formTitle: string
  submitLabel: string
  cancelContentItemForm: () => void
  updateContentList: (someContentItem: ContentItem) => void
}

interface ContentItemFormFields
  extends Pick<ContentItem, 'contentItemTitle' | 'contentItemAuthor'>,
    Pick<ContentLink, 'contentLinkHostName' | 'contentLinkUrl'> {}

function ContentItemForm(props: ContentItemFormProps) {
  const {
    formTitle,
    initialFieldValues,
    cancelContentItemForm,
    updateContentList,
    submitLabel,
  } = props
  const [formState, setFieldValues, validateForm] =
    useForm<ContentItemFormFields>({
      initialFieldValues,
      formSchema: Yup.object({
        contentItemTitle: Yup.string().required(),
        contentItemAuthor: Yup.string().required(),
        contentLinkHostName: Yup.string().required(),
        contentLinkUrl: Yup.string().url().required(),
      }),
      externalFormValidationError: {
        formError: null,
        fieldErrors: {},
      },
    })
  return (
    <FormDisplay
      formTitle={formTitle}
      formContent={
        <Fragment>
          <SSTextField
            required={true}
            label={'Title'}
            value={formState.fieldValues.contentItemTitle}
            error={Boolean(formState.fieldErrors?.contentItemTitle)}
            helperText={formState.fieldErrors?.contentItemTitle}
            onChange={(changeEvent) => {
              setFieldValues({
                contentItemTitle: changeEvent.target.value,
              })
            }}
          />
          <SSTextField
            required={true}
            label={'Author'}
            value={formState.fieldValues.contentItemAuthor}
            error={Boolean(formState.fieldErrors?.contentItemAuthor)}
            helperText={formState.fieldErrors?.contentItemAuthor}
            onChange={(changeEvent) => {
              setFieldValues({
                contentItemAuthor: changeEvent.target.value,
              })
            }}
          />
          <SSTextField
            required={true}
            label={'Host Name'}
            value={formState.fieldValues.contentLinkHostName}
            error={Boolean(formState.fieldErrors?.contentLinkHostName)}
            helperText={formState.fieldErrors?.contentLinkHostName}
            onChange={(changeEvent) => {
              setFieldValues({
                contentLinkHostName: changeEvent.target.value,
              })
            }}
          />
          <SSTextField
            required={true}
            label={'Url'}
            value={formState.fieldValues.contentLinkUrl}
            error={Boolean(formState.fieldErrors?.contentLinkUrl)}
            helperText={formState.fieldErrors?.contentLinkUrl}
            onChange={(changeEvent) => {
              setFieldValues({
                contentLinkUrl: changeEvent.target.value,
              })
            }}
          />
        </Fragment>
      }
      formActions={
        <Fragment>
          <Button
            variant={'contained'}
            onClick={async () => {
              await validateForm()
              updateContentList({
                contentItemTitle: formState.fieldValues.contentItemTitle,
                contentItemAuthor: formState.fieldValues.contentItemAuthor,
                contentItemLinks: [
                  {
                    contentLinkHostName:
                      formState.fieldValues.contentLinkHostName,
                    contentLinkUrl: formState.fieldValues.contentLinkUrl,
                  },
                ],
              })
            }}
          >
            {submitLabel}
          </Button>
          <Box paddingRight={2}>
            <Button
              onClick={() => {
                cancelContentItemForm()
              }}
            >
              Cancel
            </Button>
          </Box>
        </Fragment>
      }
      formError={null}
    />
  )
}
