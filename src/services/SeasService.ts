import * as IO from 'io-ts'
import { decodeData } from '../helpers/decodeData'
import { ContentList, getContentListCodec } from '../models/ContentList'
import {
  UserProfile,
  getUserProfileCodec,
  CurrentUser,
  getCurrentUserCodec,
} from '../models/User'

export const SeasService = {
  createCurrentUser,
  cancelAuthToken,
  getUserProfile,
  getContentList,
  createContentList,
  updateContentList,
  deleteContentList,
}

interface CreateCurrentUserApi {
  email: string
  password: string
}

function createCurrentUser(api: CreateCurrentUserApi) {
  const { email, password } = api
  return fetchSeasData({
    apiRoute: `/current-user/`,
    apiMethod: 'POST',
    apiToken: null,
    requestBody: {
      email,
      password,
    },
  })
    .then((currentUserResponse) => currentUserResponse.json())
    .then((currentUserData: unknown) => {
      return decodeData<CurrentUser>({
        targetCodec: getCurrentUserCodec(),
        inputData: currentUserData,
      })
    })
}

interface CancelAuthTokenApi extends Pick<FetchSeasDataApi, 'apiToken'> {}

function cancelAuthToken(api: CancelAuthTokenApi) {
  const { apiToken } = api
  return fetchSeasData({
    apiToken,
    apiRoute: '/rest-auth/logout/',
    apiMethod: 'POST',
  })
}

interface GetUserProfileApi {
  userId: UserProfile['id']
}

function getUserProfile(api: GetUserProfileApi) {
  const { userId } = api
  return fetchSeasData({
    apiRoute: `/user-profiles/${userId}/`,
    apiMethod: 'GET',
    apiToken: null,
  })
    .then((userProfileResponse) => userProfileResponse.json())
    .then((userProfileData: unknown) => {
      return decodeData<UserProfile>({
        targetCodec: getUserProfileCodec(),
        inputData: userProfileData,
      })
    })
}

interface GetContentListApi {
  contentListId: ContentList['id']
}

function getContentList(api: GetContentListApi) {
  const { contentListId } = api
  return fetchSeasData({
    apiRoute: `/content-lists/${contentListId}/`,
    apiMethod: 'GET',
    apiToken: null,
  })
    .then((contentListResponse) => contentListResponse.json())
    .then((contentListData: unknown) => {
      return decodeData<ContentList>({
        targetCodec: getContentListCodec(),
        inputData: contentListData,
      })
    })
}

interface CreateContentListApi extends Pick<FetchSeasDataApi, 'apiToken'> {
  contentListFormData: Pick<
    ContentList,
    'contentListTitle' | 'contentListRating' | 'contentListItems'
  >
}

function createContentList(api: CreateContentListApi) {
  const { apiToken, contentListFormData } = api
  return fetchSeasData({
    apiToken,
    apiRoute: `/content-lists/`,
    apiMethod: 'POST',
    requestBody: contentListFormData,
  })
    .then((contentListResponse) => contentListResponse.json())
    .then((contentListData: unknown) => {
      return decodeData<ContentList>({
        targetCodec: getContentListCodec(),
        inputData: contentListData,
      })
    })
}

interface UpdateContentListApi extends Pick<FetchSeasDataApi, 'apiToken'> {
  contentListId: ContentList['id']
  contentListFormData: Pick<
    ContentList,
    'contentListTitle' | 'contentListRating' | 'contentListItems'
  >
}

function updateContentList(api: UpdateContentListApi) {
  const { apiToken, contentListId, contentListFormData } = api
  return fetchSeasData({
    apiToken,
    apiRoute: `/content-lists/${contentListId}/`,
    apiMethod: 'PUT',
    requestBody: contentListFormData,
  })
    .then((contentListResponse) => contentListResponse.json())
    .then((contentListData: unknown) => {
      return decodeData<ContentList>({
        targetCodec: getContentListCodec(),
        inputData: contentListData,
      })
    })
}

interface DeleteContentListApi extends Pick<FetchSeasDataApi, 'apiToken'> {
  contentListId: ContentList['id']
}

function deleteContentList(api: DeleteContentListApi) {
  const { apiToken, contentListId } = api
  return fetchSeasData({
    apiToken,
    apiRoute: `/content-lists/${contentListId}/`,
    apiMethod: 'DELETE',
  })
}

interface FetchSeasDataApi {
  apiRoute: string
  apiMethod: 'GET' | 'POST' | 'PUT' | 'DELETE'
  apiToken: string | null
  requestBody?: object
}

function fetchSeasData(api: FetchSeasDataApi) {
  const { apiRoute, apiMethod, apiToken, requestBody } = api
  const requestHeaders: Exclude<
    Parameters<typeof fetch>[1],
    undefined
  >['headers'] = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  if (apiToken) {
    requestHeaders['Authorization'] = `Token ${apiToken}`
  }
  return fetch(`${'http://localhost:8000'}${apiRoute}`, {
    method: apiMethod,
    headers: requestHeaders,
    body: requestBody ? JSON.stringify(requestBody) : null,
  })
}
