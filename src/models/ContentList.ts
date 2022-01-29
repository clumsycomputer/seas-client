import { UserAccount } from './UserAccount'

export interface ContentList {
  contentListId: string
  contentListTitle: string
  contentListCurator: UserAccount
  contentListRating: ContentListRating
  contentListItems: Array<ContentItem>
}

export type ContentListRating = 'SAFE_FOR_WORK' | 'NOT_SAFE_FOR_WORK'

export interface ContentItem {
  contentItemTitle: string
  contentItemAuthor: string
  contentItemLinks: Array<ContentLink>
}

export interface ContentLink {
  contentLinkHostName: string
  contentLinkUrl: string
}
