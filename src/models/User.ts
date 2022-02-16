import * as IO from 'io-ts'
import * as Yup from 'yup'
import { ContentList, getContentListRatingCodec } from './ContentList'

export interface User {
  id: number
  username: string
}

export function getUserCodec() {
  return IO.exact(
    IO.type({
      id: IO.number,
      username: IO.string,
    })
  )
}

export interface CurrentUser extends Pick<User, 'id' | 'username'> {
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
  email: Yup.string().email().required(),
  password: Yup.string().required(),
})
  .required()
  .strict()

export interface UserProfile extends Pick<User, 'id' | 'username'> {
  contentLists: Array<
    Pick<ContentList, 'id' | 'contentListTitle' | 'contentListRating'>
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
              id: IO.number,
              contentListTitle: IO.string,
              contentListRating: getContentListRatingCodec(),
            })
          )
        ),
      })
    ),
  ])
}
