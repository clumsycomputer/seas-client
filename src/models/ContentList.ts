import { UserAccount } from './UserAccount'

export interface ContentList {
  contentListId: string
  contentListTitle: string
  contentListCurator: UserAccount
  contentListRating: ContentListRating
  contentListItems: Array<ContentItem>
}

export type ContentListRating = 'safeForWork' | 'notSafeForWork'

export interface ContentItem {
  contentTitle: string
  contentAuthor: string
  contentLink: {
    contentHostName: string
    contentHref: string
  }
}
