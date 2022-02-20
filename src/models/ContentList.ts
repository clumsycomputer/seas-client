import * as IO from 'io-ts'
import { Yup } from '../helpers/validateData'
import { User, getUserCodec } from './User'

export interface ContentList {
  id: string
  contentListSlug: string
  contentListTitle: string
  contentListAuthor: User
  contentListRating: ContentListRating
  contentListItems: Array<ContentItem>
}

export function getContentListCodec() {
  return IO.exact(
    IO.type({
      id: IO.string,
      contentListSlug: IO.string,
      contentListTitle: IO.string,
      contentListAuthor: getUserCodec(),
      contentListRating: getContentListRatingCodec(),
      contentListItems: IO.array(getContentItemCodec()),
    })
  )
}

export type ContentListRating = 'SAFE_FOR_WORK' | 'NOT_SAFE_FOR_WORK'

export function getContentListRatingCodec() {
  return IO.union([
    IO.literal('SAFE_FOR_WORK'),
    IO.literal('NOT_SAFE_FOR_WORK'),
  ])
}

export interface ContentItem {
  contentItemTitle: string
  contentItemAuthor: string
  contentItemLinks: Array<ContentLink>
}

export function getContentItemCodec() {
  return IO.type({
    contentItemTitle: IO.string,
    contentItemAuthor: IO.string,
    contentItemLinks: IO.array(getContentLinkCodec()),
  })
}

export interface ContentLink {
  contentLinkHostName: string
  contentLinkUrl: string
}

export function getContentLinkCodec() {
  return IO.exact(
    IO.type({
      contentLinkHostName: IO.string,
      contentLinkUrl: IO.string,
    })
  )
}

export interface ContentListFormData
  extends Pick<
    ContentList,
    'contentListTitle' | 'contentListRating' | 'contentListItems'
  > {}

export const ContentListItemsSchema = Yup.array(
  Yup.object({
    contentItemTitle: Yup.string().required(),
    contentItemAuthor: Yup.string().required(),
    contentItemLinks: Yup.array(
      Yup.object({
        contentLinkHostName: Yup.string().required(),
        contentLinkUrl: Yup.string().url().required(),
      })
    )
      .min(1)
      .required(),
  })
)
  .min(1, 'must be at least one content item')
  .required()
  .strict()

export const ContentListFormSchema = Yup.object({
  contentListTitle: Yup.string().required(),
  contentListRating: Yup.mixed()
    .oneOf(['SAFE_FOR_WORK', 'NOT_SAFE_FOR_WORK'])
    .required(),
  contentListItems: ContentListItemsSchema,
})
  .required()
  .strict()

export interface ContentItemFormData
  extends Pick<ContentItem, 'contentItemTitle' | 'contentItemAuthor'>,
    Pick<ContentLink, 'contentLinkHostName' | 'contentLinkUrl'> {}

export const ContentItemFormSchema = Yup.object({
  contentItemTitle: Yup.string().max(50).required(),
  contentItemAuthor: Yup.string().max(50).required(),
  contentLinkHostName: Yup.string().max(50).required(),
  contentLinkUrl: Yup.string().url().max(200).required(),
})
  .required()
  .strict()
