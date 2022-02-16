export interface FormState<FormFields extends object> {
  fieldValues: FormFields
  fieldErrors: FormErrors<FormFields>
  formError: string | null
}

export type FormErrors<FormFields extends object> = {
  [SomeFieldKey in keyof FormFields]?: string
}
