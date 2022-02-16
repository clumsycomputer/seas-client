import { FormErrors } from '../models/FormState'

export interface GetExternalFormValidationErrorDetailsApi<
  FormData extends object
> {
  someExternalValidationError: ExternalValidationError<FormData>
}

export type ExternalValidationError<FormData extends object> = {
  validationError: {
    nonFieldErrors?: Array<string>
  } & {
    [FormData in keyof FormData]?: Array<string>
  }
}

export interface ExternalFormValidationErrorDetails<FormData extends object> {
  formError: string | null
  fieldErrors: FormErrors<FormData>
}

export function getExternalFormValidationErrorDetails<FormData extends object>(
  api: GetExternalFormValidationErrorDetailsApi<FormData>
): ExternalFormValidationErrorDetails<FormData> {
  const { someExternalValidationError } = api
  return Object.entries(someExternalValidationError.validationError).reduce<
    ExternalFormValidationErrorDetails<FormData>
  >(
    (formErrorsResult, [someValidationErrorKey, someValidationErrorValue]) => {
      if (
        someValidationErrorKey === 'nonFieldErrors' &&
        someValidationErrorValue.length > 0
      ) {
        formErrorsResult.formError = someValidationErrorValue[0]
      } else if (someValidationErrorValue.length > 1) {
        formErrorsResult.fieldErrors[someValidationErrorKey as keyof FormData] =
          someValidationErrorValue[0]
      }
      return formErrorsResult
    },
    {
      formError: null,
      fieldErrors: {},
    }
  )
}
