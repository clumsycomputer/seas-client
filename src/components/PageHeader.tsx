import { createUseStyles } from 'react-jss'
import { AppTheme } from '../appTheme'

export interface PageHeaderProps {
  pageTitle: string
}

export function PageHeader(props: PageHeaderProps) {
  const { pageTitle } = props
  const styles = useStyles()
  return (
    <div className={styles.formHeaderContainer}>
      <div className={styles.formTitleContainer}>
        <div className={styles.formTitle}>
          {pageTitle}
          <div className={styles.formtTitleUnderline} />
        </div>
      </div>
      <div className={styles.formTitleSpacer} />
    </div>
  )
}

const useStyles = createUseStyles((appTheme: AppTheme) => {
  return {
    formHeaderContainer: {
      padding: appTheme.spacing(1),
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    formTitleContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    formTitle: {
      fontSize: 20,
      fontWeight: 600,
    },
    formtTitleUnderline: {
      width: '100%',
      height: 2,
      backgroundColor: 'black',
      marginLeft: appTheme.spacing(3 / 2),
    },
    formTitleSpacer: {
      flexGrow: 1,
    },
  }
})
