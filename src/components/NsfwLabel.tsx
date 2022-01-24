import { createUseStyles } from 'react-jss'
import { AppTheme } from '../appTheme'

export interface NsfwLabelProps {}

export function NsfwLabel(props: NsfwLabelProps) {
  const styles = useNsfwLabelStyles()
  return (
    <div className={styles.labelContainer}>
      <div className={styles.labelText}>nsfw</div>
    </div>
  )
}

const useNsfwLabelStyles = createUseStyles((appTheme: AppTheme) => {
  return {
    labelContainer: {
      paddingLeft: appTheme.spacing(1),
      paddingTop: appTheme.spacing(1),
      display: 'flex',
      flexDirection: 'row',
    },
    labelText: {
      padding: appTheme.spacing(1 / 5),
      borderStyle: 'solid',
      borderRadius: appTheme.spacing(1 / 2),
      borderWidth: 1,
      borderColor: appTheme.palette.red,
      fontWeight: 'bold',
      color: appTheme.palette.red,
    },
  }
})
