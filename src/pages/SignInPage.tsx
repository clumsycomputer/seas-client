import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserlessPage } from '../components/Page'
import { TaskState, useTask } from '../hooks/useTask'
import { CurrentUser } from '../models/User'
import { SeasService } from '../services/SeasService'

export function SignInPage() {
  const navigateToPage = useNavigate()
  const [getCurrentUserState, getCurrentUser] = useTask(
    async (signInFormState) => {
      const authTokenData: unknown = await SeasService.createAuthToken({
        email: signInFormState.email,
        password: signInFormState.password,
      })
      const authToken = (authTokenData as { key: string }).key
      const currentUserData: unknown = await SeasService.getCurrentUser({
        authToken,
      })
      const currentUser = {
        ...(currentUserData as object),
        authToken,
      } as CurrentUser
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
  const [formState, setFormState] = useState<{
    email: string
    password: string
  }>({
    email: '',
    password: '',
  })
  return (
    <Stack spacing={2} padding={2}>
      <Box>
        <Typography variant={'h6'}>Sign In</Typography>
        <Box
          sx={{
            height: 2,
            backgroundColor: 'divider',
          }}
        />
      </Box>
      <TextField
        variant={'standard'}
        label={'Email'}
        value={formState.email}
        onChange={(changeEvent) => {
          setFormState({
            ...formState,
            email: changeEvent.target.value,
          })
        }}
      />
      <TextField
        variant={'standard'}
        type={'password'}
        label={'Password'}
        value={formState.password}
        onChange={(changeEvent) => {
          setFormState({
            ...formState,
            password: changeEvent.target.value,
          })
        }}
      />
      <Button
        color={'primary'}
        disabled={getCurrentUserState.taskStatus === 'taskActive'}
        onClick={() => {
          getCurrentUser(formState)
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
    </Stack>
  )
}
