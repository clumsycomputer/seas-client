import * as Yup from 'yup'

Yup.setLocale({
  string: {
    url: 'must be a valid url',
    email: 'must be a valid email',
    max: ({ max }) => `must be no more than ${max} characters`,
  },
  mixed: {
    required: 'required',
  },
})

export { Yup }

export interface ValidateDataApi<SomeData extends object> {
  dataSchema: Yup.SchemaOf<SomeData>
  inputData: SomeData
}

export async function validateData<SomeData extends object>(
  api: ValidateDataApi<SomeData>
): Promise<SomeData> {
  const { dataSchema, inputData } = api
  try {
    const validatedData = await dataSchema.validate(
      dataSchema.cast(inputData, {
        stripUnknown: true,
      }),
      {
        strict: true,
        abortEarly: false,
      }
    )
    return validatedData as SomeData
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
        someValidationError.message
      return validationErrorDetailsResult
    },
    {}
  )
}
