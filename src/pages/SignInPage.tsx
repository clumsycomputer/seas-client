import { Button, CircularProgress, Typography } from '@mui/material'
import { Fragment, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { FormDisplay } from '../components/FormDisplay'
import { SSTextField } from '../components/FormFields'
import { UserlessPage } from '../components/Page'
import { useForm } from '../hooks/useForm'
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
  getCurrentUser: (signInFormData: { email: string; password: string }) => void
  getCurrentUserState: TaskState<CurrentUser>
}

function SignInForm(props: SignInFormProps) {
  const { getCurrentUser, getCurrentUserState } = props
  const [formValues, setFormValues, validateForm, formErrors] = useForm<{
    email: string
    password: string
  }>({
    initialFormValues: {
      email: '',
      password: '',
    },
    formSchema: Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    }),
  })
  return (
    <FormDisplay
      formTitle={'Sign In'}
      formContent={
        <Fragment>
          <SSTextField
            label={'email'}
            required={true}
            value={formValues.email}
            error={Boolean(formErrors?.email)}
            helperText={formErrors?.email}
            onChange={(someChangeEvent) => {
              setFormValues({
                email: someChangeEvent.target.value,
              })
            }}
          />
          <SSTextField
            type={'password'}
            label={'password'}
            required={true}
            value={formValues.password}
            error={Boolean(formErrors?.password)}
            helperText={formErrors?.password}
            onChange={(someChangeEvent) => {
              setFormValues({
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
              getCurrentUser(formValues)
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
        getCurrentUserState.taskStatus === 'taskError' ? (
          <Typography
            variant={'subtitle2'}
            color={'error.main'}
            textAlign={'center'}
          >
            Oops, something happened!
          </Typography>
        ) : null
      }
    />
  )
}
