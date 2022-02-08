import { User, UserCodec } from './User'
import * as IO from 'io-ts'

export interface ContentList {
  id: number
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

export const ContentListRatingCodec = IO.union([
  IO.literal('SAFE_FOR_WORK'),
  IO.literal('NOT_SAFE_FOR_WORK'),
])

export const ContentLinkCodec = IO.exact(
  IO.type({
    contentLinkHostName: IO.string,
    contentLinkUrl: IO.string,
  })
)

export const ContentItemCodec = IO.exact(
  IO.type({
    contentItemTitle: IO.string,
    contentItemAuthor: IO.string,
    contentItemLinks: IO.array(ContentLinkCodec),
  })
)

export const ContentListCodec = IO.exact(
  IO.type({
    id: IO.number,
    contentListTitle: IO.string,
    contentListAuthor: UserCodec,
    contentListRating: ContentListRatingCodec,
    contentListItems: IO.array(ContentItemCodec),
  })
)
