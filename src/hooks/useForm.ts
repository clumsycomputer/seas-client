import { useEffect, useState } from 'react'
import * as Yup from 'yup'

export interface UseFormApi<FormFields extends object> {
  initialFieldValues: FormFields
  formSchema: Yup.SchemaOf<FormFields>
  externalFormValidationError: ExternalFormValidationError<FormFields>
}

interface FormState<FormFields extends object> {
  fieldValues: FormFields
  fieldErrors: FormErrors<FormFields>
  formError: string | null
}

type FormErrors<FormFields extends object> = {
  [SomeFieldKey in keyof FormFields]?: string
}

export function useForm<FormFields extends object>(
  api: UseFormApi<FormFields>
): [
  formState: FormState<FormFields>,
  setFieldValues: (newFieldValues: Partial<FormFields>) => void,
  validateForm: () => Promise<void>
] {
  const { initialFieldValues, externalFormValidationError, formSchema } = api
  const [formState, setFormState] = useState<FormState<FormFields>>({
    fieldValues: initialFieldValues,
    fieldErrors: externalFormValidationError.fieldErrors,
    formError: externalFormValidationError.formError,
  })
  useEffect(() => {
    setFormState({
      ...formState,
      ...externalFormValidationError,
    })
  }, [externalFormValidationError])
  return [
    formState,
    (newFieldValues: Partial<FormFields>) => {
      setFormState({
        ...formState,
        fieldValues: {
          ...formState.fieldValues,
          ...newFieldValues,
        },
      })
    },
    async () => {
      try {
        await formSchema.validate(formState.fieldValues, {
          strict: true,
          abortEarly: false,
        })
        setFormState({
          ...formState,
          fieldErrors: {},
        })
      } catch (someClientValidationError: unknown) {
        if (someClientValidationError instanceof Yup.ValidationError) {
          const nextFieldErrors = parseYupFormErrors(someClientValidationError)
          setFormState({
            ...formState,
            fieldErrors: nextFieldErrors,
          })
          return Promise.reject()
        } else {
          throw new Error('wtf? useForm')
        }
      }
    },
  ]
}

function parseYupFormErrors(
  someYupValidationError: Yup.ValidationError
): Record<string, string> {
  return someYupValidationError.inner.reduce<Record<string, string>>(
    (formErrorsResult, someValidationError) => {
      formErrorsResult[someValidationError.path!] = someValidationError.type!
      return formErrorsResult
    },
    {}
  )
}

export interface GetExternalFormValidationErrorApi<FormFields extends object> {
  someExternalValidationError: ExternalValidationError<FormFields>
}

export type ExternalValidationError<ExternalFormFields extends object> = {
  validationError: {
    nonFieldErrors?: Array<string>
  } & {
    [ExternalFieldKey in keyof ExternalFormFields]?: Array<string>
  }
}

export interface ExternalFormValidationError<FormFields extends object> {
  formError: string | null
  fieldErrors: FormErrors<FormFields>
}

export function getExternalFormValidationError<FormFields extends object>(
  api: GetExternalFormValidationErrorApi<FormFields>
): ExternalFormValidationError<FormFields> {
  const { someExternalValidationError } = api
  return Object.entries(someExternalValidationError.validationError).reduce<
    ExternalFormValidationError<FormFields>
  >(
    (formErrorsResult, [someValidationErrorKey, someValidationErrorValue]) => {
      if (
        someValidationErrorKey === 'nonFieldErrors' &&
        someValidationErrorValue.length > 0
      ) {
        formErrorsResult.formError = someValidationErrorValue[0]
      } else if (someValidationErrorValue.length > 1) {
        formErrorsResult.fieldErrors[
          someValidationErrorKey as keyof FormFields
        ] = someValidationErrorValue[0]
      }
      return formErrorsResult
    },
    {
      formError: null,
      fieldErrors: {},
    }
  )
}
