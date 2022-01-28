import { useState } from 'react'
import { ActionButton } from '../components/ActionButton'
import { PageContainer } from '../components/PageContainer'
import { PageHeader } from '../components/PageHeader'
import { TextField } from '../components/TextField'

export function SignInPage() {
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
          fetch('')
        }}
      />
    </PageContainer>
  )
}
