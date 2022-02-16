import * as Yup from 'yup'

export interface ValidateDataApi<SomeData extends object> {
  dataSchema: Yup.SchemaOf<SomeData>
  inputData: SomeData
}

export async function validateData<SomeData extends object>(
  api: ValidateDataApi<SomeData>
): Promise<SomeData> {
  const { dataSchema, inputData } = api
  try {
    await dataSchema.validate(inputData, {
      strict: true,
      abortEarly: false,
    })
    return inputData
  } catch (someValidationError: unknown) {
    if (someValidationError instanceof Yup.ValidationError) {
      const validationErrorDetails = getValidationErrorDetails({
        someValidationError,
      })
      throw validationErrorDetails
    } else {
      throw new Error('wtf? validateData')
    }
  }
}

interface GetValidationErrorDetailsApi {
  someValidationError: Yup.ValidationError
}

function getValidationErrorDetails(
  api: GetValidationErrorDetailsApi
): Record<string, string> {
  const { someValidationError } = api
  return someValidationError.inner.reduce<Record<string, string>>(
    (validationErrorDetailsResult, someValidationError) => {
      validationErrorDetailsResult[someValidationError.path!] =
        someValidationError.type!
      return validationErrorDetailsResult
    },
    {}
  )
}
