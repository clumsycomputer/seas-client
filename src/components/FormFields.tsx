import { TextField, TextFieldProps } from '@mui/material'
import { Optional } from '../helpers/types'

interface SSTextFieldProps
  extends Optional<
    Pick<
      Required<TextFieldProps>,
      'type' | 'label' | 'value' | 'error' | 'helperText' | 'onChange'
    >,
    'type' | 'helperText'
  > {}

export function SSTextField(props: SSTextFieldProps) {
  const {
    label,
    value,
    error,
    onChange,
    type = 'text',
    helperText = ' ',
  } = props
  return (
    <TextField
      type={type}
      label={label}
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
