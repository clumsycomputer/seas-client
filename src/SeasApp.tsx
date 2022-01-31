import { Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { SignInPage } from './pages/SignInPage'
import { UserProfilePage } from './pages/UserProfilePage'

export function SeasApp() {
  return (
    <Routes>
      <Route path={'/'} element={<LandingPage />} />
      <Route path={'/sign-in'} element={<SignInPage />} />
      <Route path={'/:userId'} element={<UserProfilePage />} />
      {/* <Route
        path={'/content-list/create'}
        element={<CreateContentListPage />}
      />
      <Route
        path={'/content-list/:contentListId'}
        element={<ContentListPage />}
      />
      <Route
        path={'/content-list/:contentListId/edit'}
        element={<EditContentListPage />}
      /> */}
    </Routes>
  )
}
