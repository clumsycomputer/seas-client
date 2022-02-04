import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page } from '../components/Page'
import { CurrentUser } from '../models/User'
import { SeasService } from '../services/SeasService'

export function SignInPage() {
  const navigateToPage = useNavigate()
  const [formState, setFormState] = useState<{
    email: string
    password: string
  }>({
    email: '',
    password: '',
  })
  return (
    <Page
      currentUserButton={null}
      pageBody={
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
              SeasService.createAuthToken({
                email: formState.email,
                password: formState.password,
              }).then((authTokenData: unknown) => {
                const authToken = (authTokenData as { key: string }).key
                return SeasService.getCurrentUser({
                  authToken,
                }).then((currentUserData: unknown) => {
                  const currentUser = currentUserData as CurrentUser
                  window.localStorage.setItem(
                    'currentUser',
                    JSON.stringify({
                      ...currentUser,
                      authToken,
                    })
                  )
                  navigateToPage(`/${currentUser.id}`)
                })
              })
            }}
          >
            Sign In
          </Button>
        </Stack>
      }
    />
  )
}
