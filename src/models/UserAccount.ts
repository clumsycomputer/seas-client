import { ContentList } from './ContentList'

export interface UserAccount {
  id: string
  username: string
  contentLists: Array<{
    id: ContentList['id']
    contentListTitle: ContentList['contentListTitle']
    contentListRating: ContentList['contentListRating']
  }>
}
