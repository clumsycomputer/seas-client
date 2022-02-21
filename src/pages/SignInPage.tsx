import { Button, CircularProgress, Typography } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormDisplay } from '../components/FormDisplay'
import { SSTextField } from '../components/FormFields'
import { UserlessPage } from '../components/Page'
import { getExternalFormValidationErrorDetails } from '../helpers/getExternalFormValidationError'
import { validateData } from '../helpers/validateData'
import { TaskState, useTask } from '../hooks/useTask'
import { FormErrors, FormState } from '../models/FormState'
import {
  CurrentUser,
  CurrentUserFormData,
  CurrentUserFormSchema,
} from '../models/User'
import { SeasService } from '../services/SeasService'

export function SignInPage() {
  const navigateToPage = useNavigate()
  const [createCurrentUserState, createCurrentUser] = useTask(
    async (currentUserFormData: CurrentUserFormData) => {
      const currentUser = await SeasService.createCurrentUser({
        currentUserFormData,
      })
      return currentUser
    }
  )
  useEffect(() => {
    if (createCurrentUserState.taskStatus === 'taskSuccessful') {
      const currentUser = createCurrentUserState.taskResult
      window.localStorage.setItem('currentUser', JSON.stringify(currentUser))
      navigateToPage(`/${createCurrentUserState.taskResult.username}`, {
        replace: true,
      })
    }
  }, [createCurrentUserState])
  return (
    <UserlessPage
      pageBody={
        <SignInForm
          createCurrentUserState={createCurrentUserState}
          createCurrentUser={createCurrentUser}
        />
      }
    />
  )
}

interface SignInFormProps {
  createCurrentUser: (currentUserFormData: CurrentUserFormData) => void
  createCurrentUserState: TaskState<CurrentUser>
}

function SignInForm(props: SignInFormProps) {
  const { createCurrentUser, createCurrentUserState } = props
  const [formState, setFormState] = useState<FormState<CurrentUserFormData>>({
    fieldValues: {
      email: '',
      password: '',
    },
    fieldErrors: {},
    formError: null,
  })
  useEffect(() => {
    if (
      createCurrentUserState.taskStatus === 'taskError' &&
      createCurrentUserState.taskError.validationError
    ) {
      const externalFormValidationErrorDetails =
        getExternalFormValidationErrorDetails({
          someExternalValidationError: createCurrentUserState.taskError,
        })
      setFormState({
        ...formState,
        fieldErrors: externalFormValidationErrorDetails.fieldErrors,
        formError: externalFormValidationErrorDetails.formError,
      })
    } else if (createCurrentUserState.taskStatus === 'taskError') {
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
  }, [createCurrentUserState])
  return (
    <FormDisplay
      formTitle={'Sign In'}
      formContent={
        <Fragment>
          <SSTextField
            label={'email'}
            value={formState.fieldValues.email}
            error={Boolean(formState.fieldErrors?.email)}
            helperText={formState.fieldErrors?.email}
            onChange={(someChangeEvent) => {
              setFormState({
                ...formState,
                fieldValues: {
                  ...formState.fieldValues,
                  email: someChangeEvent.target.value,
                },
              })
            }}
          />
          <SSTextField
            type={'password'}
            label={'password'}
            value={formState.fieldValues.password}
            error={Boolean(formState.fieldErrors?.password)}
            helperText={formState.fieldErrors?.password}
            onChange={(someChangeEvent) => {
              setFormState({
                ...formState,
                fieldValues: {
                  ...formState.fieldValues,
                  password: someChangeEvent.target.value,
                },
              })
            }}
          />
        </Fragment>
      }
      formActions={
        <Fragment>
          <Button
            fullWidth={true}
            color={'primary'}
            disabled={createCurrentUserState.taskStatus === 'taskActive'}
            onClick={async () => {
              try {
                const validatedFields = await validateData<CurrentUserFormData>(
                  {
                    dataSchema: CurrentUserFormSchema,
                    inputData: formState.fieldValues,
                  }
                )
                createCurrentUser(validatedFields)
              } catch (someValidationErrorDetailsError: unknown) {
                const someValidationErrorDetails =
                  someValidationErrorDetailsError as FormErrors<CurrentUserFormData>
                setFormState({
                  ...formState,
                  fieldErrors: someValidationErrorDetails,
                  formError: null,
                })
              }
            }}
          >
            Sign In
            {createCurrentUserState.taskStatus === 'taskActive' ? (
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
          </Button>
        </Fragment>
      }
      formError={
        formState.formError ? (
          <Typography
            variant={'body2'}
            color={'error.main'}
            textAlign={'center'}
          >
            {formState.formError}
          </Typography>
        ) : null
      }
    />
  )
}
