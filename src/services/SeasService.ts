import { ContentList } from '../models/ContentList'

export interface CreateAuthTokenApi {
  email: string
  password: string
}

export function createAuthToken(api: CreateAuthTokenApi) {
  const { email, password } = api
  return fetchSeasData({
    apiRoute: `/rest-auth/login/`,
    apiMethod: 'POST',
    authToken: null,
    requestBody: {
      email,
      password,
    },
  }).then((authTokenResponse) => authTokenResponse.json())
}

export interface GetCurrentUserApi
  extends Pick<FetchSeasDataApi, 'authToken'> {}

export function getCurrentUser(api: GetCurrentUserApi) {
  const { authToken } = api
  return fetchSeasData({
    authToken,
    apiRoute: `/current-user/`,
    apiMethod: 'GET',
  })
}

export interface GetUserProfileApi {
  userId: string
}

export function getUserProfile(api: GetUserProfileApi) {
  const { userId } = api
  return fetchSeasData({
    apiRoute: `/user-profiles/${userId}/`,
    apiMethod: 'GET',
    authToken: null,
  }).then((userProfileResponse) => userProfileResponse.json())
}
export interface GetContentListApi {
  contentListId: string
}

export function getContentList(api: GetContentListApi) {
  const { contentListId } = api
  return fetchSeasData({
    apiRoute: `/content-lists/${contentListId}/`,
    apiMethod: 'GET',
    authToken: null,
  }).then((contentListResponse) => contentListResponse.json())
}

export interface CreateContentListApi
  extends Pick<FetchSeasDataApi, 'authToken'> {
  contentListFormData: Pick<
    ContentList,
    'contentListTitle' | 'contentListRating' | 'contentListItems'
  >
}

export function createContentList(api: CreateContentListApi) {
  const { authToken, contentListFormData } = api
  return fetchSeasData({
    authToken,
    apiRoute: `/content-lists/`,
    apiMethod: 'POST',
    requestBody: contentListFormData,
  }).then((contentListResponse) => contentListResponse.json())
}

export interface UpdateContentListApi
  extends Pick<FetchSeasDataApi, 'authToken'> {
  contentListId: string
  contentListFormData: Pick<
    ContentList,
    'contentListTitle' | 'contentListRating' | 'contentListItems'
  >
}

export function updateContentList(api: UpdateContentListApi) {
  const { authToken, contentListId, contentListFormData } = api
  return fetchSeasData({
    authToken,
    apiRoute: `/content-lists/${contentListId}/`,
    apiMethod: 'PUT',
    requestBody: contentListFormData,
  }).then((contentListResponse) => contentListResponse.json())
}

export interface DeleteContentListApi
  extends Pick<FetchSeasDataApi, 'authToken'> {
  contentListId: string
}

export function deleteContentList(api: DeleteContentListApi) {
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
