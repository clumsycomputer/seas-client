import * as IO from 'io-ts'
import { ContentList, ContentListRatingCodec } from './ContentList'

export interface User {
  id: number
  username: string
}

export interface CurrentUser extends Pick<User, 'id' | 'username'> {
  email: string
  authToken: string
}

export interface UserProfile extends Pick<User, 'id' | 'username'> {
  contentLists: Array<
    Pick<ContentList, 'id' | 'contentListTitle' | 'contentListRating'>
  >
}

export const UserCodec = IO.exact(
  IO.type({
    id: IO.number,
    username: IO.string,
  })
)

export const CurrentUserCodec = IO.intersection([
  UserCodec,
  IO.exact(
    IO.type({
      email: IO.string,
      authToken: IO.string,
    })
  ),
])

export const UserProfileCodec = IO.intersection([
  UserCodec,
  IO.exact(
    IO.type({
      contentLists: IO.array(
        IO.exact(
          IO.type({
            id: IO.number,
            contentListTitle: IO.string,
            contentListRating: ContentListRatingCodec,
          })
        )
      ),
    })
  ),
])
