import { createUseStyles } from 'react-jss'
import { AppTheme } from '../appTheme'

export interface TextFieldProps
  extends Required<
    Pick<
      React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >,
      'onChange' | 'value'
    >
  > {
  fieldLabel: string
}

export function TextField(props: TextFieldProps) {
  const { fieldLabel, onChange, value } = props
  const styles = useStyles()
  return (
    <div className={styles.fieldContainer}>
      <div className={styles.fieldLabelContainer}>
        <div className={styles.fieldLabel}>{fieldLabel}</div>
      </div>
      <div className={styles.fieldInputContainer}>
        <input
          onChange={onChange}
          value={value}
          className={styles.fieldInput}
          type={'text'}
        />
      </div>
    </div>
  )
}

const useStyles = createUseStyles((appTheme: AppTheme) => {
  return {
    fieldContainer: {
      flexShrink: 1,
      padding: appTheme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
    },
    fieldLabelContainer: {
      display: 'flex',
      alignItems: 'flex-end',
      paddingBottom: appTheme.spacing(1 / 4),
    },
    fieldLabel: {
      fontWeight: 400,
    },
    fieldInputContainer: {},
    fieldInput: {},
  }
})
