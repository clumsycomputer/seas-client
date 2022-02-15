import { Button, CircularProgress, Typography } from '@mui/material'
import { Fragment, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { FormDisplay } from '../components/FormDisplay'
import { SSTextField } from '../components/FormFields'
import { UserlessPage } from '../components/Page'
import {
  ExternalFormValidationError,
  getExternalFormValidationError,
  useForm,
} from '../hooks/useForm'
import { TaskState, useTask } from '../hooks/useTask'
import { CurrentUser } from '../models/User'
import { SeasService } from '../services/SeasService'

export function SignInPage() {
  const navigateToPage = useNavigate()
  const [getCurrentUserState, getCurrentUser] = useTask(
    async (signInFormState) => {
      const currentUser = await SeasService.createCurrentUser({
        email: signInFormState.email,
        password: signInFormState.password,
      })
      return currentUser
    }
  )
  useEffect(() => {
    if (getCurrentUserState.taskStatus === 'taskSuccessful') {
      const currentUser = getCurrentUserState.taskResult
      window.localStorage.setItem('currentUser', JSON.stringify(currentUser))
      navigateToPage(`/${currentUser.id}`, {
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
  getCurrentUser: (currentUserFormData: CurrentUserFormFields) => void
  getCurrentUserState: TaskState<CurrentUser>
}

interface CurrentUserFormFields {
  email: string
  password: string
}

function SignInForm(props: SignInFormProps) {
  const { getCurrentUser, getCurrentUserState } = props
  const externalCurrentUserFormValidationError = useMemo<
    ExternalFormValidationError<CurrentUserFormFields>
  >(() => {
    if (
      getCurrentUserState.taskStatus === 'taskError' &&
      getCurrentUserState.taskError.validationError
    ) {
      return getExternalFormValidationError({
        someExternalValidationError: getCurrentUserState.taskError,
      })
    } else if (getCurrentUserState.taskStatus === 'taskError') {
      return {
        formError: 'Oops, something happened!',
        fieldErrors: {},
      }
    } else {
      return {
        formError: null,
        fieldErrors: {},
      }
    }
  }, [getCurrentUserState])
  const [formState, setFieldValues, validateForm] =
    useForm<CurrentUserFormFields>({
      initialFieldValues: {
        email: '',
        password: '',
      },
      formSchema: Yup.object({
        email: Yup.string().email().required(),
        password: Yup.string().required(),
      }),
      externalFormValidationError: externalCurrentUserFormValidationError,
    })
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
              setFieldValues({
                email: someChangeEvent.target.value,
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
              setFieldValues({
                password: someChangeEvent.target.value,
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
              await validateForm()
              getCurrentUser(formState.fieldValues)
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
            variant={'subtitle2'}
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
