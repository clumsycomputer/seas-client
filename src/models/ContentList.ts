import { User } from './User'

export interface ContentList {
  id: string
  contentListTitle: string
  contentListAuthor: User
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
