import { appConfig } from '../appConfig'
import { decodeData } from '../helpers/decodeData'
import {
  ContentList,
  ContentListFormData,
  getContentListCodec,
} from '../models/ContentList'
import {
  CurrentUser,
  CurrentUserFormData,
  getCurrentUserCodec,
  getUserProfileCodec,
  UserProfile,
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
  currentUserFormData: CurrentUserFormData
}

function createCurrentUser(api: CreateCurrentUserApi) {
  const { currentUserFormData } = api
  return fetchSeasData({
    apiRoute: `/current-user/`,
    apiMethod: 'POST',
    apiToken: null,
    requestBody: {
      email: currentUserFormData.email,
      password: currentUserFormData.password,
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

interface GetUserProfileApi extends Pick<UserProfile, 'username'> {}

function getUserProfile(api: GetUserProfileApi) {
  const { username } = api
  return fetchSeasData({
    apiRoute: `/user-profiles/${username}/`,
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

interface GetContentListApi extends Pick<ContentList, 'id'> {}

function getContentList(api: GetContentListApi) {
  const { id } = api
  return fetchSeasData({
    apiRoute: `/content-lists/${id}/`,
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
  contentListFormData: ContentListFormData
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

interface UpdateContentListApi
  extends Pick<FetchSeasDataApi, 'apiToken'>,
    Pick<ContentList, 'id'> {
  contentListFormData: ContentListFormData
}

function updateContentList(api: UpdateContentListApi) {
  const { apiToken, id, contentListFormData } = api
  return fetchSeasData({
    apiToken,
    apiRoute: `/content-lists/${id}/`,
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

interface DeleteContentListApi
  extends Pick<FetchSeasDataApi, 'apiToken'>,
    Pick<ContentList, 'contentListTitle'> {}

function deleteContentList(api: DeleteContentListApi) {
  const { apiToken, contentListTitle } = api
  return fetchSeasData({
    apiToken,
    apiRoute: `/content-lists/${contentListTitle}/`,
    apiMethod: 'DELETE',
  })
}

interface FetchSeasDataApi {
  apiRoute: string
  apiMethod: 'GET' | 'POST' | 'PUT' | 'DELETE'
  apiToken: string | null
  requestBody?: object
}

async function fetchSeasData(api: FetchSeasDataApi) {
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
  const seasResponse = await fetch(`${appConfig.apiUrl}${apiRoute}`, {
    method: apiMethod,
    headers: requestHeaders,
    body: requestBody ? JSON.stringify(requestBody) : null,
  })
  if (seasResponse.ok) {
    return seasResponse
  } else {
    const errorResponseBody: unknown = await seasResponse.json()
    throw errorResponseBody
  }
}
