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
  createAuthToken,
  cancelAuthToken,
  getCurrentUser,
  getUserProfile,
  getContentList,
  createContentList,
  updateContentList,
  deleteContentList,
}

interface CreateAuthTokenApi {
  email: string
  password: string
}

function createAuthToken(api: CreateAuthTokenApi) {
  const { email, password } = api
  return fetchSeasData({
    apiRoute: `/rest-auth/login/`,
    apiMethod: 'POST',
    authToken: null,
    requestBody: {
      email,
      password,
    },
  })
    .then((authTokenResponse) => authTokenResponse.json())
    .then((authTokenData: unknown) => {
      return decodeData<{ key: string }>({
        targetCodec: IO.exact(IO.type({ key: IO.string })),
        inputData: authTokenData,
      })
    })
}

interface CancelAuthTokenApi extends Pick<FetchSeasDataApi, 'authToken'> {}

function cancelAuthToken(api: CancelAuthTokenApi) {
  const { authToken } = api
  return fetchSeasData({
    authToken,
    apiRoute: '/rest-auth/logout/',
    apiMethod: 'POST',
  })
}

interface GetCurrentUserApi extends Pick<FetchSeasDataApi, 'authToken'> {}

function getCurrentUser(api: GetCurrentUserApi) {
  const { authToken } = api
  return fetchSeasData({
    authToken,
    apiRoute: `/current-user/`,
    apiMethod: 'GET',
  })
    .then((currentUserResponse) => currentUserResponse.json())
    .then((currentUserData: unknown) => {
      return decodeData<CurrentUser>({
        targetCodec: getCurrentUserCodec(),
        inputData: {
          ...(currentUserData as object),
          authToken,
        },
      })
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
    authToken: null,
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
    authToken: null,
  })
    .then((contentListResponse) => contentListResponse.json())
    .then((contentListData: unknown) => {
      return decodeData<ContentList>({
        targetCodec: getContentListCodec(),
        inputData: contentListData,
      })
    })
}

interface CreateContentListApi extends Pick<FetchSeasDataApi, 'authToken'> {
  contentListFormData: Pick<
    ContentList,
    'contentListTitle' | 'contentListRating' | 'contentListItems'
  >
}

function createContentList(api: CreateContentListApi) {
  const { authToken, contentListFormData } = api
  return fetchSeasData({
    authToken,
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

interface UpdateContentListApi extends Pick<FetchSeasDataApi, 'authToken'> {
  contentListId: ContentList['id']
  contentListFormData: Pick<
    ContentList,
    'contentListTitle' | 'contentListRating' | 'contentListItems'
  >
}

function updateContentList(api: UpdateContentListApi) {
  const { authToken, contentListId, contentListFormData } = api
  return fetchSeasData({
    authToken,
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

interface DeleteContentListApi extends Pick<FetchSeasDataApi, 'authToken'> {
  contentListId: ContentList['id']
}

function deleteContentList(api: DeleteContentListApi) {
  const { authToken, contentListId } = api
  return fetchSeasData({
    authToken,
    apiRoute: `/content-lists/${contentListId}/`,
    apiMethod: 'DELETE',
  })
}

interface FetchSeasDataApi {
  apiRoute: string
  apiMethod: 'GET' | 'POST' | 'PUT' | 'DELETE'
  authToken: string | null
  requestBody?: object
}

function fetchSeasData(api: FetchSeasDataApi) {
  const { apiRoute, apiMethod, authToken, requestBody } = api
  const requestHeaders: Exclude<
    Parameters<typeof fetch>[1],
    undefined
  >['headers'] = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  if (authToken) {
    requestHeaders['Authorization'] = `Token ${authToken}`
  }
  return fetch(`${'http://localhost:8000'}${apiRoute}`, {
    method: apiMethod,
    headers: requestHeaders,
    body: requestBody ? JSON.stringify(requestBody) : null,
  })
}
