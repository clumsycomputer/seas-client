import { Fragment, ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useCurrentUser } from './hooks/useCurrentUser'
import { ContentListPage } from './pages/ContentListPage'
import { CreateContentListPage } from './pages/CreateContentListPage'
import { EditContentListPage } from './pages/EditContentListPage'
import { LandingPage } from './pages/LandingPage'
import { SignInPage } from './pages/SignInPage'
import { SignOutPage } from './pages/SignOutPage'
import { UserProfilePage } from './pages/UserProfilePage'

export function SeasApp() {
  return (
    <Routes>
      <Route path={'/'} element={<LandingPage />} />
      <Route path={'/sign-in'} element={<SignInPage />} />
      <Route path={'/sign-out'} element={<SignOutPage />} />
      <Route path={'/:userId'} element={<UserProfilePage />} />
      <Route
        path={'/content-list/create'}
        element={
          <CurrentUserPage>
            <CreateContentListPage />
          </CurrentUserPage>
        }
      />
      <Route
        path={'/content-list/:contentListId'}
        element={<ContentListPage />}
      />
      <Route
        path={'/content-list/:contentListId/edit'}
        element={
          <CurrentUserPage>
            <EditContentListPage />
          </CurrentUserPage>
        }
      />
    </Routes>
  )
}

interface CurrentUserPageProps {
  children: ReactNode
}

function CurrentUserPage(props: CurrentUserPageProps) {
  const { children } = props
  const currentUser = useCurrentUser()
  return currentUser !== null ? (
    <Fragment>{children}</Fragment>
  ) : (
    <Navigate to={'/sign-in'} />
  )
}
