import { Fragment, ReactNode, useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import { useParams } from 'react-router-dom'
import { AppTheme } from '../appTheme'
import { LinkLabel } from '../components/LinkLabel'
import { NsfwLabel } from '../components/NsfwLabel'
import { PageContainer } from '../components/PageContainer'
import { TextLabel } from '../components/TextLabel'
import { UserAccount } from '../models/UserAccount'

export interface UserProfilePageProps {}

export function UserProfilePage(props: UserProfilePageProps) {
  const styles = useStyles()
  const routeParams = useParams()
  const [pageContent, setPageContent] = useState<ReactNode>(
    <div>Loading...</div>
  )
  useEffect(() => {
    fetch(`http://localhost:8000/user/${routeParams.userId}`)
      .then((getUserResponse) => getUserResponse.json())
      .then((userResponseData: unknown) => {
        const userAccount = userResponseData as UserAccount
        setPageContent(
          <Fragment>
            <TextLabel displayText={userAccount.username} />
            {userAccount.contentLists.map((someContentList) => {
              return (
                <div
                  key={`${someContentList.id}`}
                  className={styles.contentListItemContainer}
                >
                  <div className={styles.contentListItemDivider} />
                  <div className={styles.contentListHeaderRow}>
                    <div className={styles.contentListTitleContainer}>
                      <TextLabel
                        displayText={someContentList.contentListTitle}
                      />
                      {someContentList.contentListRating ===
                      'NOT_SAFE_FOR_WORK' ? (
                        <NsfwLabel />
                      ) : null}
                    </div>
                    <div className={styles.viewListActionContainer}>
                      <LinkLabel
                        displayText={'view list'}
                        linkHref={`/content-list/${someContentList.id}`}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </Fragment>
        )
      })
  }, [])
  return <PageContainer>{pageContent}</PageContainer>
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
