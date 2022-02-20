import * as IO from 'io-ts'
import { Yup } from '../helpers/validateData'
import { ContentList, getContentListRatingCodec } from './ContentList'

export interface User {
  username: string
}

export function getUserCodec() {
  return IO.exact(
    IO.type({
      username: IO.string,
    })
  )
}

export interface CurrentUser extends Pick<User, 'username'> {
  email: string
  apiToken: string
}

export function getCurrentUserCodec() {
  return IO.intersection([
    getUserCodec(),
    IO.exact(
      IO.type({
        email: IO.string,
        apiToken: IO.string,
      })
    ),
  ])
}

export interface CurrentUserFormData {
  email: string
  password: string
}

export const CurrentUserFormSchema = Yup.object({
  email: Yup.string().email().required('please enter an email'),
  password: Yup.string().required('please enter a password'),
})
  .required()
  .strict()

export interface UserProfile extends Pick<User, 'username'> {
  contentLists: Array<
    Pick<
      ContentList,
      'id' | 'contentListSlug' | 'contentListTitle' | 'contentListRating'
    >
  >
}

export function getUserProfileCodec() {
  return IO.intersection([
    getUserCodec(),
    IO.exact(
      IO.type({
        contentLists: IO.array(
          IO.exact(
            IO.type({
              id: IO.string,
              contentListSlug: IO.string,
              contentListTitle: IO.string,
              contentListRating: getContentListRatingCodec(),
            })
          )
        ),
      })
    ),
  ])
}
