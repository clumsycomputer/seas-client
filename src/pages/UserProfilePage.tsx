import { createUseStyles } from 'react-jss'
import { appData } from '../appData'
import { AppTheme } from '../appTheme'
import { LinkLabel } from '../components/LinkLabel'
import { NsfwLabel } from '../components/NsfwLabel'
import { PageContainer } from '../components/PageContainer'
import { TextLabel } from '../components/TextLabel'

export interface UserProfilePageProps {}

export function UserProfilePage(props: UserProfilePageProps) {
  const styles = useStyles()
  const userAccount = appData.userAccounts['aaa']
  const userAccountContentLists = Object.values(appData.contentLists).filter(
    (someContentList) => {
      return (
        someContentList.contentListCurator.userAccountId ===
        userAccount.userAccountId
      )
    }
  )
  return (
    <PageContainer>
      <TextLabel displayText={userAccount.username} />
      {userAccountContentLists.map((someContentList) => {
        return (
          <div className={styles.contentListItemContainer}>
            <div className={styles.contentListItemDivider} />
            <div className={styles.contentListHeaderRow}>
              <div className={styles.contentListTitleContainer}>
                <TextLabel displayText={someContentList.contentListTitle} />
                {someContentList.contentListRating === 'notSafeForWork' ? (
                  <NsfwLabel />
                ) : null}
              </div>
              <div className={styles.viewListActionContainer}>
                <LinkLabel
                  displayText={'view list'}
                  linkHref={`/content-list/${someContentList.contentListId}`}
                />
              </div>
            </div>
          </div>
        )
      })}
    </PageContainer>
  )
}

const useStyles = createUseStyles((appTheme: AppTheme) => {
  return {
    contentListItemContainer: {
      width: '100%',
      paddingTop: appTheme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
    },
    contentListHeaderRow: {
      display: 'flex',
      flexDirection: 'row',
    },
    contentListTitleContainer: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'row',
    },
    contentListItemDivider: {
      height: 2,
      backgroundColor: appTheme.palette.lightGray,
      borderRadius: 2,
    },
    viewListActionContainer: {
      paddingLeft: appTheme.spacing(1),
      paddingRight: appTheme.spacing(1),
    },
  }
})
