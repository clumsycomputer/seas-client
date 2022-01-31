import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page } from '../components/Page'
import { CurrentUser } from '../models/User'

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
              fetch(`http://localhost:8000/rest-auth/login/`, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: formState.email,
                  password: formState.password,
                }),
              })
                .then((loginResponse) => loginResponse.json())
                .then((loginResponseData: unknown) => {
                  const authToken = (loginResponseData as { key: string }).key
                  return fetch('http://localhost:8000/current-user', {
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                      Authorization: `Token ${authToken}`,
                    },
                  })
                    .then((currentUserResponse) => currentUserResponse.json())
                    .then((currentUserData: unknown) => {
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
