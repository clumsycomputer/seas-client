import * as IO from 'io-ts'
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
  authToken: string
}

export function getCurrentUserCodec() {
  return IO.intersection([
    getUserCodec(),
    IO.exact(
      IO.type({
        email: IO.string,
        authToken: IO.string,
      })
    ),
  ])
}

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
