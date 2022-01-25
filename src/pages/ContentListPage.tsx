import { createUseStyles } from 'react-jss'
import { appData } from '../appData'
import { AppTheme } from '../appTheme'
import { LinkLabel } from '../components/LinkLabel'
import { NsfwLabel } from '../components/NsfwLabel'
import { PageContainer } from '../components/PageContainer'
import { TextLabel } from '../components/TextLabel'
import { ContentItem, ContentList } from '../models/ContentList'

export interface ContentListPageProps {}

export function ContentListPage(props: ContentListPageProps) {
  const styles = useContentListPageStyles()
  const contentList = appData.contentLists['aaa']
  return (
    <PageContainer>
      <ContentListHeader
        contentListTitle={contentList.contentListTitle}
        contentListCurator={contentList.contentListCurator}
        contentListRating={contentList.contentListRating}
      />
      {contentList.contentListItems.map(
        (someContentItem, someContentItemIndex) => {
          return (
            <ContentListItem
              key={`${someContentItemIndex}`}
              contentTitle={someContentItem.contentTitle}
              contentAuthor={someContentItem.contentAuthor}
              contentLink={someContentItem.contentLink}
            />
          )
        }
      )}
      <div className={styles.footerSpacer} />
    </PageContainer>
  )
}

const useContentListPageStyles = createUseStyles((theme: AppTheme) => {
  return {
    pageContainer: {
      padding: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
    },
    footerSpacer: {
      height: theme.spacing(3),
    },
  }
})

interface ContentListHeaderProps
  extends Pick<
    ContentList,
    'contentListTitle' | 'contentListCurator' | 'contentListRating'
  > {}

function ContentListHeader(props: ContentListHeaderProps) {
  const { contentListTitle, contentListCurator, contentListRating } = props
  const styles = useContentListHeaderStyles()
  return (
    <div className={styles.headerContainer}>
      <div className={styles.topRowContainer}>
        <TextLabel displayText={contentListTitle} />
        {contentListRating === 'notSafeForWork' ? <NsfwLabel /> : null}
      </div>
      <TextLabel displayText={contentListCurator.username} />
    </div>
  )
}

const useContentListHeaderStyles = createUseStyles((theme: AppTheme) => {
  return {
    headerContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    topRowContainer: {
      display: 'flex',
      flexDirection: 'row',
    },
  }
})

interface ContentListItemProps
  extends Pick<ContentItem, 'contentTitle' | 'contentAuthor' | 'contentLink'> {}

function ContentListItem(props: ContentListItemProps) {
  const { contentTitle, contentAuthor, contentLink } = props
  const styles = useContentItemStyles()
  return (
    <div className={styles.itemContainer}>
      <div className={styles.itemDivider}></div>
      <TextLabel displayText={contentTitle} />
      <TextLabel displayText={contentAuthor} />
      <div className={styles.linksContainer}>
        <LinkLabel
          displayText={contentLink.contentHostName}
          linkHref={contentLink.contentHref}
        />
      </div>
    </div>
  )
}

const useContentItemStyles = createUseStyles((theme: AppTheme) => {
  return {
    itemContainer: {
      paddingTop: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
    },
    itemDivider: {
      height: 2,
      backgroundColor: theme.palette.lightGray,
      borderRadius: 2,
    },
    linksContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  }
})
