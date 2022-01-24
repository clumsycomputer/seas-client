import { Routes, Route } from 'react-router-dom'
import { ContentListPage } from './pages/ContentListPage'
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
    </Routes>
  )
}
