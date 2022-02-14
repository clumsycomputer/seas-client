import { string } from 'fp-ts'
import { useState } from 'react'
import * as Yup from 'yup'

export interface UseFormApi<CurrentFormShape extends object> {
  formSchema: Yup.SchemaOf<StrictFormShape<CurrentFormShape>>
  initialFormValues: StrictFormShape<CurrentFormShape>
}

type StrictFormShape<SomeFormShape extends object> = {
  [SomeFormKey in keyof SomeFormShape]: SomeFormShape[SomeFormKey]
}

type FormErrors<
  SomeFormShape extends object,
  SomeStrictFormShape = StrictFormShape<SomeFormShape>
> = {
  [SomeFieldKey in keyof SomeStrictFormShape]?: string
}

export function useForm<CurrentFormShape extends object>(
  api: UseFormApi<CurrentFormShape>
): [
  formValues: StrictFormShape<CurrentFormShape>,
  setFormValues: (
    newFormValues: Partial<StrictFormShape<CurrentFormShape>>
  ) => void,
  validateForm: () => Promise<void>,
  formErrors: FormErrors<CurrentFormShape>
] {
  const { initialFormValues, formSchema } = api
  const [formValues, setFormValues] =
    useState<StrictFormShape<CurrentFormShape>>(initialFormValues)
  const [formErrors, setFormErrors] = useState<FormErrors<CurrentFormShape>>({})
  return [
    formValues,
    (newFormValues: Partial<StrictFormShape<CurrentFormShape>>) => {
      setFormValues({
        ...formValues,
        ...newFormValues,
      })
    },
    async () => {
      try {
        await formSchema.validate(formValues, {
          strict: true,
          abortEarly: false,
        })
        setFormErrors({})
      } catch (someFormValidationError: unknown) {
        if (someFormValidationError instanceof Yup.ValidationError) {
          setFormErrors(parseYupFormErrors(someFormValidationError))
          return Promise.reject()
        } else {
          throw new Error('wtf? useForm')
        }
      }
    },
    formErrors,
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
