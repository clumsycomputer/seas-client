import { Fragment, ReactNode } from 'react'
import { Navigate, Params, Route, Routes, useParams } from 'react-router-dom'
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
      <Route path={'/:username'} element={<UserProfilePage />} />
      <Route
        path={'/:username/create'}
        element={
          <ProtectedPage
            somePage={<CreateContentListPage />}
            getUserHasPermission={({ currentUser, routeParams }) => {
              return currentUser?.username === routeParams.username
            }}
            getRedirectionRoute={({ routeParams }) => {
              return `/${routeParams.username}`
            }}
          />
        }
      />
      <Route path={'/:username/:contentListId'} element={<ContentListPage />} />
      <Route
        path={'/:username/:contentListId/edit'}
        element={
          <ProtectedPage
            somePage={<EditContentListPage />}
            getUserHasPermission={({ currentUser, routeParams }) => {
              return currentUser?.username === routeParams.username
            }}
            getRedirectionRoute={({ routeParams }) => {
              return `/${routeParams.username}/${routeParams.contentListId}`
            }}
          />
        }
      />
    </Routes>
  )
}

interface ProtectedPageProps {
  somePage: ReactNode
  getUserHasPermission: (api: GetUserHasPermissionApi) => boolean
  getRedirectionRoute: (api: GetRedirectionRouteApi) => string
}

interface GetUserHasPermissionApi {
  routeParams: Readonly<Params<string>> // ReturnType<typeof useParams>
  currentUser: ReturnType<typeof useCurrentUser>
}

interface GetRedirectionRouteApi {
  routeParams: Readonly<Params<string>> // ReturnType<typeof useParams>
  currentUser: ReturnType<typeof useCurrentUser>
}

function ProtectedPage(props: ProtectedPageProps) {
  const { getUserHasPermission, getRedirectionRoute, somePage } = props
  const routeParams = useParams()
  const currentUser = useCurrentUser()
  const userHasPermission = getUserHasPermission({
    routeParams,
    currentUser,
  })
  const redirectionRoute = getRedirectionRoute({
    routeParams,
    currentUser,
  })
  return userHasPermission ? (
    <Fragment>{somePage}</Fragment>
  ) : (
    <Navigate to={redirectionRoute} />
  )
}
