import { createUseStyles } from 'react-jss'
import { AppTheme } from '../appTheme'

export interface LinkLabelProps {
  displayText: string
  linkHref: string
}

export function LinkLabel(props: LinkLabelProps) {
  const { displayText, linkHref } = props
  const styles = useStyles()
  return (
    <div className={styles.labelContainer}>
      <a className={styles.labelText} href={linkHref}>
        {displayText}
      </a>
    </div>
  )
}

const useStyles = createUseStyles((theme: AppTheme) => {
  return {
    labelContainer: {
      paddingLeft: theme.spacing(1),
      paddingTop: theme.spacing(1 / 2),
      display: 'flex',
      flexDirection: 'row',
    },
    labelText: {
      padding: theme.spacing(1 / 2),
      fontWeight: 'bold',
      textAlign: 'right',
    },
  }
})
