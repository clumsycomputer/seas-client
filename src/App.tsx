import { Routes, Route } from 'react-router-dom'
import { ContentListPage } from './pages/ContentListPage'
import { CreateContentListPage } from './pages/CreateContentListPage'
import { UserProfilePage } from './pages/UserProfilePage'

export default App

function App() {
  return (
    <Routes>
      <Route path={'/user/:userAccountId'} element={<UserProfilePage />} />
      <Route
        path={'/content-list/:contentListId'}
        element={<ContentListPage />}
      />
      <Route
        path={'/content-list/create'}
        element={<CreateContentListPage />}
      />
    </Routes>
  )
}
