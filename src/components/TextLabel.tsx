import { createUseStyles } from 'react-jss'
import { AppTheme } from '../appTheme'

export interface TextLabelProps {
  displayText: string
}

export function TextLabel(props: TextLabelProps) {
  const { displayText } = props
  const styles = useStyles()
  return (
    <div className={styles.labelContainer}>
      <div className={styles.labelText}>{displayText}</div>
    </div>
  )
}

const useStyles = createUseStyles((theme: AppTheme) => {
  return {
    labelContainer: {
      paddingLeft: theme.spacing(1),
      paddingTop: theme.spacing(1),
      display: 'flex',
      flexDirection: 'row',
    },
    labelText: {
      padding: theme.spacing(1 / 2),
      backgroundColor: theme.palette.lightGray,
      borderRadius: theme.spacing(1 / 2),
      fontWeight: 'bold',
    },
  }
})
