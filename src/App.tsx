import { Routes, Route } from 'react-router-dom'
import { ContentListPage } from './pages/ContentListPage'
import { CreateContentListPage } from './pages/CreateContentListPage'
import { EditContentListPage } from './pages/EditContentListPage'
import { LandingPage } from './pages/LandingPage'
import { SignInPage } from './pages/SignInPage'
import { UserProfilePage } from './pages/UserProfilePage'

export default App

function App() {
  return (
    <Routes>
      <Route path={'/'} element={<LandingPage />} />
      <Route path={'/sign-in'} element={<SignInPage />} />
      <Route path={'/user/:userId'} element={<UserProfilePage />} />
      <Route
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
      />
    </Routes>
  )
}
