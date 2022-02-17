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
  const [getCurrentUserState, getCurrentUser] = useTask(
    async (currentUserFormData: CurrentUserFormData) => {
      const currentUser = await SeasService.createCurrentUser({
        currentUserFormData,
      })
      return currentUser
    }
  )
  useEffect(() => {
    if (getCurrentUserState.taskStatus === 'taskSuccessful') {
      const currentUser = getCurrentUserState.taskResult
      window.localStorage.setItem('currentUser', JSON.stringify(currentUser))
      navigateToPage(`/${getCurrentUserState.taskResult.username}`, {
        replace: true,
      })
    }
  }, [getCurrentUserState])
  return (
    <UserlessPage
      pageBody={
        <SignInForm
          getCurrentUserState={getCurrentUserState}
          getCurrentUser={getCurrentUser}
        />
      }
    />
  )
}

interface SignInFormProps {
  getCurrentUser: (currentUserFormData: CurrentUserFormData) => void
  getCurrentUserState: TaskState<CurrentUser>
}

function SignInForm(props: SignInFormProps) {
  const { getCurrentUser, getCurrentUserState } = props
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
      getCurrentUserState.taskStatus === 'taskError' &&
      getCurrentUserState.taskError.validationError
    ) {
      const externalFormValidationErrorDetails =
        getExternalFormValidationErrorDetails({
          someExternalValidationError: getCurrentUserState.taskError,
        })
      setFormState({
        ...formState,
        fieldErrors: externalFormValidationErrorDetails.fieldErrors,
        formError: externalFormValidationErrorDetails.formError,
      })
    } else if (getCurrentUserState.taskStatus === 'taskError') {
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
  }, [getCurrentUserState])
  return (
    <FormDisplay
      formTitle={'Sign In'}
      formContent={
        <Fragment>
          <SSTextField
            label={'email'}
            required={true}
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
            required={true}
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
            disabled={getCurrentUserState.taskStatus === 'taskActive'}
            onClick={async () => {
              try {
                const validatedFields = await validateData<CurrentUserFormData>(
                  {
                    dataSchema: CurrentUserFormSchema,
                    inputData: formState.fieldValues,
                  }
                )
                getCurrentUser(validatedFields)
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
            {getCurrentUserState.taskStatus === 'taskActive' ? (
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
