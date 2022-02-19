export interface GetSeasServiceErrorMessageApi {
  someServiceError: any
}

export function getSeasServiceErrorMessage(api: GetSeasServiceErrorMessageApi) {
  const { someServiceError } = api
  switch (someServiceError.statusCode) {
    case 404:
      return '404: Content List Not Found'
    default:
      return 'Oops, something happened!'
  }
}
