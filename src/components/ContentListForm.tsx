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
  Typography,
} from '@mui/material'
import { Fragment, ReactNode, useEffect, useState } from 'react'
import * as Yup from 'yup'
import { TaskState } from '../hooks/useTask'
import {
  ContentItem,
  ContentLink,
  ContentList,
  ContentListRating,
} from '../models/ContentList'
import { SSTextField } from './FormFields'
import { MenuButton } from './MenuButton'

export interface ContentListFormProps
  extends Pick<UseFormApi<ContentListFormValues>, 'initialFormValues'> {
  formTitle: string
  submitLabel: string
  submitFormState: TaskState<ContentList>
  submitForm: (validatedFormValues: ContentListFormValues) => void
  cancelContentListForm: () => void
}

interface ContentListFormValues
  extends Pick<
    ContentList,
    'contentListTitle' | 'contentListRating' | 'contentListItems'
  > {}

export function ContentListForm(props: ContentListFormProps) {
  const {
    initialFormValues,
    formTitle,
    cancelContentListForm,
    submitLabel,
    submitFormState,
    submitForm,
  } = props
  const [formValues, setFormValues, validateForm, formErrors] = useForm({
    initialFormValues,
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
  })
  useEffect(() => {
    if (
      formErrors.contentListItems === 'min' &&
      formValues.contentListItems.length > 0
    ) {
      validateForm()
    }
  }, [formValues, formErrors])
  const [contentItemFormDialogState, setContentItemFormDialogState] = useState<
    | {
        dialogOpen: false
      }
    | ({
        dialogOpen: true
      } & Pick<
        ContentItemFormProps,
        'formTitle' | 'submitLabel' | 'updateContentList' | 'initialFormValues'
      >)
  >({
    dialogOpen: false,
  })
  return (
    <FormDisplay
      formTitle={formTitle}
      cancelDialogFormAction={
        <Button
          onClick={() => {
            cancelContentListForm()
          }}
        >
          Cancel
        </Button>
      }
      formContent={
        <Fragment>
          <SSTextField
            required={true}
            label={'Title'}
            value={formValues.contentListTitle}
            error={Boolean(formErrors?.contentListTitle)}
            helperText={formErrors?.contentListTitle}
            onChange={(changeEvent) => {
              setFormValues({
                contentListTitle: changeEvent.target.value,
              })
            }}
          />
          <FormControl variant={'standard'} sx={{ m: 1, minWidth: 120 }}>
            <InputLabel required={true}>Content Rating</InputLabel>
            <Select
              value={formValues.contentListRating}
              onChange={(changeEvent) => {
                setFormValues({
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
            {formValues.contentListItems.length > 0 ? (
              formValues.contentListItems.map(
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
                                    initialFormValues: {
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
                                        ...formValues.contentListItems,
                                      ]
                                      nextContentListItems.splice(
                                        contentItemIndex,
                                        1,
                                        updatedContentItem
                                      )
                                      setFormValues({
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
                                    ...formValues.contentListItems,
                                  ]
                                  nextContentListItems.splice(
                                    contentItemIndex,
                                    1
                                  )
                                  setFormValues({
                                    contentListItems: nextContentListItems,
                                  })
                                },
                              },
                              {
                                children: 'Move Item Up',
                                disabled: contentItemIndex === 0,
                                onClick: () => {
                                  const nextContentListItems = [
                                    ...formValues.contentListItems,
                                  ]
                                  nextContentListItems.splice(
                                    contentItemIndex - 1,
                                    0,
                                    nextContentListItems.splice(
                                      contentItemIndex,
                                      1
                                    )[0]
                                  )
                                  setFormValues({
                                    contentListItems: nextContentListItems,
                                  })
                                },
                              },
                              {
                                children: 'Move Item Down',
                                disabled:
                                  contentItemIndex ===
                                  formValues.contentListItems.length - 1,
                                onClick: () => {
                                  const nextContentListItems = [
                                    ...formValues.contentListItems,
                                  ]
                                  nextContentListItems.splice(
                                    contentItemIndex + 1,
                                    0,
                                    nextContentListItems.splice(
                                      contentItemIndex,
                                      1
                                    )[0]
                                  )
                                  setFormValues({
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
                      formErrors?.contentListItems ? 'error.main' : 'GrayText'
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
                  initialFormValues: {
                    contentItemTitle: '',
                    contentItemAuthor: '',
                    contentLinkHostName: '',
                    contentLinkUrl: '',
                  },
                  updateContentList: async (newContentItem) => {
                    setFormValues({
                      contentListItems: [
                        ...formValues.contentListItems,
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
                formErrors?.contentListItems === 'min' &&
                formValues.contentListItems.length === 0
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
                initialFormValues={contentItemFormDialogState.initialFormValues}
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
              submitForm(formValues)
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
  extends Pick<UseFormApi<ContentItemFormValues>, 'initialFormValues'> {
  formTitle: string
  submitLabel: string
  cancelContentItemForm: () => void
  updateContentList: (someContentItem: ContentItem) => void
}

interface ContentItemFormValues
  extends Pick<ContentItem, 'contentItemTitle' | 'contentItemAuthor'>,
    Pick<ContentLink, 'contentLinkHostName' | 'contentLinkUrl'> {}

function ContentItemForm(props: ContentItemFormProps) {
  const {
    formTitle,
    initialFormValues,
    cancelContentItemForm,
    updateContentList,
    submitLabel,
  } = props
  const [formValues, setFormValues, validateForm, formErrors] = useForm({
    initialFormValues,
    formSchema: Yup.object({
      contentItemTitle: Yup.string().required(),
      contentItemAuthor: Yup.string().required(),
      contentLinkHostName: Yup.string().required(),
      contentLinkUrl: Yup.string().url().required(),
    }),
  })
  return (
    <FormDisplay
      formTitle={formTitle}
      cancelDialogFormAction={
        <Button
          onClick={() => {
            cancelContentItemForm()
          }}
        >
          Cancel
        </Button>
      }
      formContent={
        <Fragment>
          <SSTextField
            required={true}
            label={'Title'}
            value={formValues.contentItemTitle}
            error={Boolean(formErrors?.contentItemTitle)}
            helperText={formErrors?.contentItemTitle}
            onChange={(changeEvent) => {
              setFormValues({
                contentItemTitle: changeEvent.target.value,
              })
            }}
          />
          <SSTextField
            required={true}
            label={'Author'}
            value={formValues.contentItemAuthor}
            error={Boolean(formErrors?.contentItemAuthor)}
            helperText={formErrors?.contentItemAuthor}
            onChange={(changeEvent) => {
              setFormValues({
                contentItemAuthor: changeEvent.target.value,
              })
            }}
          />
          <SSTextField
            required={true}
            label={'Host Name'}
            value={formValues.contentLinkHostName}
            error={Boolean(formErrors?.contentLinkHostName)}
            helperText={formErrors?.contentLinkHostName}
            onChange={(changeEvent) => {
              setFormValues({
                contentLinkHostName: changeEvent.target.value,
              })
            }}
          />
          <SSTextField
            required={true}
            label={'Url'}
            value={formValues.contentLinkUrl}
            error={Boolean(formErrors?.contentLinkUrl)}
            helperText={formErrors?.contentLinkUrl}
            onChange={(changeEvent) => {
              setFormValues({
                contentLinkUrl: changeEvent.target.value,
              })
            }}
          />
        </Fragment>
      }
      formActions={
        <Button
          variant={'contained'}
          onClick={async () => {
            await validateForm()
            updateContentList({
              contentItemTitle: formValues.contentItemTitle,
              contentItemAuthor: formValues.contentItemAuthor,
              contentItemLinks: [
                {
                  contentLinkHostName: formValues.contentLinkHostName,
                  contentLinkUrl: formValues.contentLinkUrl,
                },
              ],
            })
          }}
        >
          {submitLabel}
        </Button>
      }
      formError={null}
    />
  )
}

interface FormDisplayProps {
  formTitle: string
  cancelDialogFormAction: ReactNode
  formContent: ReactNode
  formActions: ReactNode
  formError: ReactNode
}

function FormDisplay(props: FormDisplayProps) {
  const {
    formTitle,
    cancelDialogFormAction,
    formContent,
    formActions,
    formError,
  } = props
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
      <Stack spacing={2.5}>{formContent}</Stack>
      <Box
        display={'flex'}
        flexDirection={'row-reverse'}
        paddingTop={3}
        paddingBottom={1}
      >
        {formActions}
      </Box>
      {formError}
    </Stack>
  )
}

type StrictFormShape<SomeFormShape extends object> = {
  [SomeFormKey in keyof SomeFormShape]: SomeFormShape[SomeFormKey]
}

type FormErrors<
  SomeFormShape extends object,
  SomeStrictFormShape = StrictFormShape<SomeFormShape>
> = {
  [SomeFieldKey in keyof SomeStrictFormShape]?: string
}

interface UseFormApi<CurrentFormShape extends object> {
  formSchema: Yup.SchemaOf<StrictFormShape<CurrentFormShape>>
  initialFormValues: StrictFormShape<CurrentFormShape>
}

function useForm<CurrentFormShape extends object>(
  api: UseFormApi<CurrentFormShape>
): [
  formValues: StrictFormShape<CurrentFormShape>,
  setFormValues: (
    newFormValues: Partial<StrictFormShape<CurrentFormShape>>
  ) => void,
  validateForm: () => Promise<void>,
  formErrors: FormErrors<CurrentFormShape>
] {
  const { initialFormValues, formSchema } = api
  const [formValues, setFormValues] =
    useState<StrictFormShape<CurrentFormShape>>(initialFormValues)
  const [formErrors, setFormErrors] = useState<FormErrors<CurrentFormShape>>({})
  return [
    formValues,
    (newFormValues: Partial<StrictFormShape<CurrentFormShape>>) => {
      setFormValues({
        ...formValues,
        ...newFormValues,
      })
    },
    async () => {
      try {
        await formSchema.validate(formValues, {
          strict: true,
          abortEarly: false,
        })
        setFormErrors({})
      } catch (someFormValidationError: unknown) {
        if (someFormValidationError instanceof Yup.ValidationError) {
          setFormErrors(parseYupFormErrors(someFormValidationError))
          return Promise.reject()
        } else {
          throw new Error('wtf? useForm')
        }
      }
    },
    formErrors,
  ]
}

function parseYupFormErrors(someYupValidationError: Yup.ValidationError): any {
  return someYupValidationError.inner.reduce<any>(
    (formErrorsResult, someValidationError) => {
      formErrorsResult[someValidationError.path!] = someValidationError.type!
      return formErrorsResult
    },
    {} as any
  )
}
