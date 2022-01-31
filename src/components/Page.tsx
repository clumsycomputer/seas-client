import { AccountCircle } from '@mui/icons-material'
import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material'
import { Fragment, ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CurrentUser } from '../models/User'

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
  const [currentUserMenuAnchor, setCurrentUserMenuAnchor] =
    useState<HTMLElement | null>(null)
  return (
    <Page
      pageBody={pageBody}
      currentUserButton={
        <Fragment>
          <IconButton
            color={'inherit'}
            onClick={(clickEvent) => {
              setCurrentUserMenuAnchor(clickEvent.currentTarget)
            }}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            keepMounted={true}
            anchorEl={currentUserMenuAnchor}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(currentUserMenuAnchor)}
            onClose={() => {
              setCurrentUserMenuAnchor(null)
            }}
          >
            <MenuItem
              onClick={() => {
                navigateToPage(`/${currentUser.id}`)
              }}
            >
              Profile
            </MenuItem>
            <MenuItem onClick={() => {}}>Sign Out</MenuItem>
          </Menu>
        </Fragment>
      }
    />
  )
}
