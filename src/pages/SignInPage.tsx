import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActionButton } from '../components/ActionButton'
import { PageContainer } from '../components/PageContainer'
import { PageHeader } from '../components/PageHeader'
import { TextField } from '../components/TextField'
import { CurrentUser } from '../models/User'

export function SignInPage() {
  const navigateSite = useNavigate()
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  })
  return (
    <PageContainer>
      <PageHeader pageTitle={'Sign In'} />
      <TextField
        fieldLabel={'Email'}
        value={formState.email}
        onChange={(changeEvent) => {
          setFormState({
            ...formState,
            email: changeEvent.target.value,
          })
        }}
      />
      <TextField
        fieldLabel={'Password'}
        value={formState.password}
        onChange={(changeEvent) => {
          setFormState({
            ...formState,
            password: changeEvent.target.value,
          })
        }}
      />
      <ActionButton
        disabled={false}
        buttonLabel={'Sign In'}
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
                  navigateSite(`/user/${currentUser.id}`)
                })
            })
        }}
      />
    </PageContainer>
  )
}
