import { ContentList } from './ContentList'

export interface User {
  id: string
  username: string
}

export interface CurrentUser extends Pick<User, 'id' | 'username'> {
  email: string
  authToken: string
}

export interface UserProfile extends Pick<User, 'id' | 'username'> {
  contentLists: Array<{
    id: ContentList['id']
    contentListTitle: ContentList['contentListTitle']
    contentListRating: ContentList['contentListRating']
  }>
}
