import { TextField, TextFieldProps } from '@mui/material'
import { Optional } from '../helpers/types'

interface SSTextFieldProps
  extends Optional<
    Pick<
      Required<TextFieldProps>,
      'label' | 'required' | 'value' | 'error' | 'helperText' | 'onChange'
    >,
    'helperText'
  > {}

export function SSTextField(props: SSTextFieldProps) {
  const { label, required, value, error, onChange, helperText = ' ' } = props
  return (
    <TextField
      label={label}
      required={required}
      value={value}
      error={error}
      onChange={onChange}
      helperText={helperText}
      variant={'standard'}
      InputLabelProps={{
        shrink: true,
      }}
    />
  )
}
