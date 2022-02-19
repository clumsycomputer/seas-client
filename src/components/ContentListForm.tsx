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
import { getExternalFormValidationErrorDetails } from '../helpers/getExternalFormValidationError'
import { validateData } from '../helpers/validateData'
import { TaskState } from '../hooks/useTask'
import {
  ContentItem,
  ContentItemFormData,
  ContentItemFormSchema,
  ContentList,
  ContentListFormData,
  ContentListFormSchema,
  ContentListItemsSchema,
  ContentListRating,
} from '../models/ContentList'
import { FormErrors, FormState } from '../models/FormState'
import { FormDisplay } from './FormDisplay'
import { SSTextField } from './FormFields'
import { DenseMenuButton, MenuButton } from './MenuButton'

export interface ContentListFormProps {
  initialFieldValues: ContentListFormData
  formTitle: string
  submitLabel: string
  submitFormState: TaskState<ContentList>
  submitForm: (validateFieldValues: ContentListFormData) => void
  cancelContentListForm: () => void
}

export function ContentListForm(props: ContentListFormProps) {
  const {
    initialFieldValues,
    formTitle,
    cancelContentListForm,
    submitLabel,
    submitFormState,
    submitForm,
  } = props
  const [formState, setFormState] = useState<FormState<ContentListFormData>>({
    fieldValues: initialFieldValues,
    fieldErrors: {},
    formError: null,
  })
  useEffect(() => {
    if (formState.fieldErrors?.contentListItems) {
      try {
        validateData<Pick<ContentListFormData, 'contentListItems'>>({
          dataSchema: Yup.object({
            contentListItems: ContentListItemsSchema,
          }).required(),
          inputData: {
            contentListItems: formState.fieldValues.contentListItems,
          },
        }).then(() => {
          const { contentListItems, ...remainingFieldErrors } =
            formState.fieldErrors
          setFormState({
            ...formState,
            fieldErrors: {
              ...remainingFieldErrors,
            },
          })
        })
      } catch (someValidationErrorDetailsError: unknown) {
        const someValidationErrorDetails =
          someValidationErrorDetailsError as FormErrors<
            Pick<ContentListFormData, 'contentListItems'>
          >
        setFormState({
          ...formState,
          fieldErrors: {
            ...formState.fieldErrors,
            ...someValidationErrorDetails,
          },
        })
      }
    }
  }, [formState])
  useEffect(() => {
    if (
      submitFormState.taskStatus === 'taskError' &&
      submitFormState.taskError.validationError
    ) {
      const externalFormValidationErrorDetails =
        getExternalFormValidationErrorDetails({
          someExternalValidationError: submitFormState.taskError,
        })
      setFormState({
        ...formState,
        fieldErrors: externalFormValidationErrorDetails.fieldErrors,
        formError: externalFormValidationErrorDetails.formError,
      })
    } else if (submitFormState.taskStatus === 'taskError') {
      setFormState({
        ...formState,
        fieldErrors: {},
        formError: 'Oops, something happened!',
      })
    } else {
      setFormState({
        ...formState,
        fieldErrors: {},
        formError: null,
      })
    }
  }, [submitFormState])
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
            label={'List Name'}
            value={formState.fieldValues.contentListTitle}
            error={Boolean(formState.fieldErrors?.contentListTitle)}
            helperText={formState.fieldErrors?.contentListTitle}
            onChange={(changeEvent) => {
              setFormState({
                ...formState,
                fieldValues: {
                  ...formState.fieldValues,
                  contentListTitle: changeEvent.target.value,
                },
              })
            }}
          />
          <FormControl variant={'standard'} sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>List Rating</InputLabel>
            <Select
              value={formState.fieldValues.contentListRating}
              onChange={(changeEvent) => {
                setFormState({
                  ...formState,
                  fieldValues: {
                    ...formState.fieldValues,
                    contentListRating: changeEvent.target
                      .value as ContentListRating,
                  },
                })
              }}
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
                      key={`${someContentItem.contentItemTitle}_${contentItemIndex}`}
                      secondaryAction={
                        <Box>
                          <DenseMenuButton
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
                                      setFormState({
                                        ...formState,
                                        fieldValues: {
                                          ...formState.fieldValues,
                                          contentListItems:
                                            nextContentListItems,
                                        },
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
                                  setFormState({
                                    ...formState,
                                    fieldValues: {
                                      ...formState.fieldValues,
                                      contentListItems: nextContentListItems,
                                    },
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
                                  setFormState({
                                    ...formState,
                                    fieldValues: {
                                      ...formState.fieldValues,
                                      contentListItems: nextContentListItems,
                                    },
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
                                  setFormState({
                                    ...formState,
                                    fieldValues: {
                                      ...formState.fieldValues,
                                      contentListItems: nextContentListItems,
                                    },
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
          <Box paddingBottom={2} display={'flex'} flexDirection={'column'}>
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
                    setFormState({
                      ...formState,
                      fieldValues: {
                        ...formState.fieldValues,
                        contentListItems: [
                          ...formState.fieldValues.contentListItems,
                          newContentItem,
                        ],
                      },
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
              try {
                const validatedFieldValues =
                  await validateData<ContentListFormData>({
                    dataSchema: ContentListFormSchema,
                    inputData: formState.fieldValues,
                  })
                submitForm(validatedFieldValues)
              } catch (someValidationErrorDetailsError: unknown) {
                const someValidationErrorDetails =
                  someValidationErrorDetailsError as FormErrors<ContentListFormData>
                setFormState({
                  ...formState,
                  fieldErrors: someValidationErrorDetails,
                })
              }
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
        formState.formError !== null ? (
          <Typography
            variant={'body2'}
            display={'flex'}
            flexDirection={'row-reverse'}
            color={'error.main'}
          >
            {formState.formError}
          </Typography>
        ) : null
      }
    />
  )
}

interface ContentItemFormProps {
  initialFieldValues: ContentItemFormData
  formTitle: string
  submitLabel: string
  cancelContentItemForm: () => void
  updateContentList: (someContentItem: ContentItem) => void
}

function ContentItemForm(props: ContentItemFormProps) {
  const {
    formTitle,
    initialFieldValues,
    cancelContentItemForm,
    updateContentList,
    submitLabel,
  } = props
  const [formState, setFormState] = useState<FormState<ContentItemFormData>>({
    fieldValues: initialFieldValues,
    fieldErrors: {},
    formError: null,
  })
  return (
    <FormDisplay
      formTitle={formTitle}
      formContent={
        <Fragment>
          <SSTextField
            label={'Content Name'}
            value={formState.fieldValues.contentItemTitle}
            error={Boolean(formState.fieldErrors?.contentItemTitle)}
            helperText={formState.fieldErrors?.contentItemTitle}
            onChange={(changeEvent) => {
              setFormState({
                ...formState,
                fieldValues: {
                  ...formState.fieldValues,
                  contentItemTitle: changeEvent.target.value,
                },
              })
            }}
          />
          <SSTextField
            label={'Content Author'}
            value={formState.fieldValues.contentItemAuthor}
            error={Boolean(formState.fieldErrors?.contentItemAuthor)}
            helperText={formState.fieldErrors?.contentItemAuthor}
            onChange={(changeEvent) => {
              setFormState({
                ...formState,
                fieldValues: {
                  ...formState.fieldValues,
                  contentItemAuthor: changeEvent.target.value,
                },
              })
            }}
          />
          <SSTextField
            label={'Content Host'}
            value={formState.fieldValues.contentLinkHostName}
            error={Boolean(formState.fieldErrors?.contentLinkHostName)}
            helperText={formState.fieldErrors?.contentLinkHostName}
            onChange={(changeEvent) => {
              setFormState({
                ...formState,
                fieldValues: {
                  ...formState.fieldValues,
                  contentLinkHostName: changeEvent.target.value,
                },
              })
            }}
          />
          <SSTextField
            label={'Content Url'}
            value={formState.fieldValues.contentLinkUrl}
            error={Boolean(formState.fieldErrors?.contentLinkUrl)}
            helperText={formState.fieldErrors?.contentLinkUrl}
            onChange={(changeEvent) => {
              setFormState({
                ...formState,
                fieldValues: {
                  ...formState.fieldValues,
                  contentLinkUrl: changeEvent.target.value,
                },
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
              try {
                const validatedFieldValues =
                  await validateData<ContentItemFormData>({
                    dataSchema: ContentItemFormSchema,
                    inputData: formState.fieldValues,
                  })
                updateContentList({
                  contentItemTitle: validatedFieldValues.contentItemTitle,
                  contentItemAuthor: validatedFieldValues.contentItemAuthor,
                  contentItemLinks: [
                    {
                      contentLinkHostName:
                        validatedFieldValues.contentLinkHostName,
                      contentLinkUrl: validatedFieldValues.contentLinkUrl,
                    },
                  ],
                })
              } catch (someValidationErrorDetailsError: unknown) {
                const someValidationErrorDetails =
                  someValidationErrorDetailsError as FormErrors<ContentItemFormData>
                setFormState({
                  ...formState,
                  fieldErrors: someValidationErrorDetails,
                })
              }
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
