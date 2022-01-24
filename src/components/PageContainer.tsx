import { ReactNode } from 'react'
import { createUseStyles } from 'react-jss'
import { AppTheme } from '../appTheme'

interface PageContainerProps {
  children: ReactNode
}

export function PageContainer(props: PageContainerProps) {
  const { children } = props
  const styles = useStyles()
  return <div className={styles.pageContainer}>{children}</div>
}

const useStyles = createUseStyles((appTheme: AppTheme) => {
  return {
    pageContainer: {
      padding: appTheme.spacing(1),
    },
  }
})
