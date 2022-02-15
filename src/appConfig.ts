export interface AppConfig {
  apiUrl: string
}

export const appConfig: AppConfig = {
  apiUrl: tryEnviromentVariable({
    variableName: 'REACT_APP_API_URL',
  }),
}

interface TryEnvironmentVariableApi {
  variableName: string
}

function tryEnviromentVariable(api: TryEnvironmentVariableApi) {
  const { variableName } = api
  const environmentVariable = process.env[variableName]
  if (environmentVariable === undefined) {
    throw new Error(`environment variable "${variableName}" is undefined`)
  }
  return environmentVariable
}
