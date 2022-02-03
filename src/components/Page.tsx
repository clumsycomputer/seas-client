import { AccountCircle } from '@mui/icons-material'
import { AppBar, Button, Toolbar, Typography } from '@mui/material'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { CurrentUser } from '../models/User'
import { MenuButton } from './MenuButton'

export interface PageProps {
  currentUserButton: ReactNode
  pageBody: ReactNode
}

export function Page(props: PageProps) {
  const { currentUserButton, pageBody } = props
  return (
    <div>
      <AppBar position={'static'} elevation={0}>
        <Toolbar>
          <Typography variant={'h6'} sx={{ flexGrow: 1 }}>
            seas.io
          </Typography>
          {currentUserButton}
        </Toolbar>
      </AppBar>
      {pageBody}
    </div>
  )
}

export interface LoggedOutUserPageProps extends Pick<PageProps, 'pageBody'> {}

export function LoggedOutUserPage(props: LoggedOutUserPageProps) {
  const { pageBody } = props
  const navigateToPage = useNavigate()
  return (
    <Page
      pageBody={pageBody}
      currentUserButton={
        <Button
          color={'inherit'}
          onClick={() => {
            navigateToPage('/sign-in')
          }}
        >
          Sign In
        </Button>
      }
    />
  )
}

export interface LoggedInUserPageProps extends Pick<PageProps, 'pageBody'> {
  currentUser: CurrentUser
}

export function LoggedInUserPage(props: LoggedInUserPageProps) {
  const { pageBody, currentUser } = props
  const navigateToPage = useNavigate()
  return (
    <Page
      pageBody={pageBody}
      currentUserButton={
        <MenuButton
          buttonColor={'inherit'}
          buttonIcon={<AccountCircle />}
          menuItems={[
            {
              children: 'Profile',
              onClick: () => {
                navigateToPage(`/${currentUser.id}`)
              },
            },
            {
              children: 'Sign Out',
              onClick: () => {},
            },
          ]}
        />
      }
    />
  )
}
