import { AccountCircle } from '@mui/icons-material'
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { CurrentUser } from '../models/User'
import { MenuButton } from './MenuButton'

export interface UserPageProps extends Pick<PageBaseProps, 'pageBody'> {
  currentUser: ReturnType<typeof useCurrentUser>
}

export function UserPage(props: UserPageProps) {
  const { currentUser, pageBody } = props
  if (currentUser === null) {
    return <LoggedOutPage pageBody={pageBody} />
  } else if (currentUser) {
    return <LoggedInPage currentUser={currentUser} pageBody={pageBody} />
  } else {
    throw new Error('wtf? UserPage')
  }
}

interface LoggedInPageProps extends Pick<PageBaseProps, 'pageBody'> {
  currentUser: CurrentUser
}

function LoggedInPage(props: LoggedInPageProps) {
  const { pageBody, currentUser } = props
  const navigateToPage = useNavigate()
  return (
    <PageBase
      pageBody={pageBody}
      currentUserButton={
        <MenuButton
          buttonColor={'inherit'}
          buttonIcon={<AccountCircle />}
          menuItems={[
            {
              children: 'Profile',
              onClick: () => {
                navigateToPage(`/${currentUser.id}`, {
                  replace: true,
                })
              },
            },
            {
              children: 'Sign Out',
              onClick: () => {
                navigateToPage(
                  `/sign-out?target-route=${window.location.pathname}`,
                  {
                    replace: true,
                  }
                )
              },
            },
          ]}
        />
      }
    />
  )
}

interface LoggedOutPageProps extends Pick<PageBaseProps, 'pageBody'> {}

function LoggedOutPage(props: LoggedOutPageProps) {
  const { pageBody } = props
  const navigateToPage = useNavigate()
  return (
    <PageBase
      pageBody={pageBody}
      currentUserButton={
        <Button
          color={'inherit'}
          onClick={() => {
            navigateToPage('/sign-in', { replace: true })
          }}
        >
          Sign In
        </Button>
      }
    />
  )
}

export interface UserlessPageProps extends Pick<PageBaseProps, 'pageBody'> {}

export function UserlessPage(props: UserlessPageProps) {
  const { pageBody } = props
  return <PageBase currentUserButton={null} pageBody={pageBody} />
}

interface PageBaseProps {
  currentUserButton: ReactNode
  pageBody: ReactNode
}

function PageBase(props: PageBaseProps) {
  const { currentUserButton, pageBody } = props
  return (
    <Box display={'flex'} flexDirection={'column'} sx={{ height: '100vh' }}>
      <AppBar position={'static'} elevation={0}>
        <Toolbar>
          <Typography variant={'h6'} sx={{ flexGrow: 1 }}>
            seas.io
          </Typography>
          {currentUserButton}
        </Toolbar>
      </AppBar>
      {pageBody}
    </Box>
  )
}
