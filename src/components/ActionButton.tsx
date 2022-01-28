import { createUseStyles } from 'react-jss'
import { AppTheme } from '../appTheme'

export interface ActionButtonProps
  extends Required<
    Pick<
      React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >,
      'onClick' | 'disabled'
    >
  > {
  buttonLabel: string
}

export function ActionButton(props: ActionButtonProps) {
  const { disabled, onClick, buttonLabel } = props
  const styles = useActionButtonStyles()
  return (
    <div className={styles.buttonContainer}>
      <button
        className={styles.actionButton}
        type={'button'}
        disabled={disabled}
        onClick={onClick}
      >
        {buttonLabel}
      </button>
    </div>
  )
}

export const useActionButtonStyles = createUseStyles((appTheme: AppTheme) => {
  return {
    buttonContainer: {
      flexShrink: 0,
      padding: appTheme.spacing(1),
      display: 'flex',
      flexDirection: 'row',
    },
    actionButton: {
      flexGrow: 1,
    },
  }
})
