import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page } from '../components/Page'
import { useTask } from '../hooks/useTask'
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
      navigateToPage(`/${currentUser.id}`)
    }
  }, [getCurrentUserState])
  return (
    <Page
      currentUserButton={null}
      pageBody={<SignInForm getCurrentUser={getCurrentUser} />}
    />
  )
}

interface SignInFormProps {
  getCurrentUser: (signInFormData: { email: string; password: string }) => void
}

function SignInForm(props: SignInFormProps) {
  const { getCurrentUser } = props
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
        color={'inherit'}
        onClick={() => {
          getCurrentUser(formState)
        }}
      >
        Sign In
      </Button>
    </Stack>
  )
}
