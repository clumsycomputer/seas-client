import { Fragment, ReactNode, useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import { useParams } from 'react-router-dom'
import { AppTheme } from '../appTheme'
import { LinkLabel } from '../components/LinkLabel'
import { NsfwLabel } from '../components/NsfwLabel'
import { PageContainer } from '../components/PageContainer'
import { TextLabel } from '../components/TextLabel'
import { ContentItem, ContentList } from '../models/ContentList'

export interface ContentListPageProps {}

export function ContentListPage(props: ContentListPageProps) {
  const styles = useContentListPageStyles()
  const routeParams = useParams()
  const [pageContent, setPageContent] = useState<ReactNode>(
    <div>Loading...</div>
  )
  useEffect(() => {
    fetch(`http://localhost:8000/content-list/${routeParams.contentListId}`)
      .then((getContentListResponse) => getContentListResponse.json())
      .then((contentListResponseData: unknown) => {
        const contentList = contentListResponseData as ContentList
        setPageContent(
          <Fragment>
            <ContentListHeader
              contentListTitle={contentList.contentListTitle}
              contentListAuthor={contentList.contentListAuthor}
              contentListRating={contentList.contentListRating}
            />
            {contentList.contentListItems.map(
              (someContentItem, someContentItemIndex) => {
                return (
                  <ContentListItem
                    key={`${someContentItemIndex}`}
                    contentItemTitle={someContentItem.contentItemTitle}
                    contentItemAuthor={someContentItem.contentItemAuthor}
                    contentItemLinks={someContentItem.contentItemLinks}
                  />
                )
              }
            )}
            <div className={styles.footerSpacer} />
          </Fragment>
        )
      })
  }, [])
  return <PageContainer>{pageContent}</PageContainer>
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
    'contentListTitle' | 'contentListAuthor' | 'contentListRating'
  > {}

function ContentListHeader(props: ContentListHeaderProps) {
  const { contentListTitle, contentListAuthor, contentListRating } = props
  const styles = useContentListHeaderStyles()
  return (
    <div className={styles.headerContainer}>
      <div className={styles.topRowContainer}>
        <TextLabel displayText={contentListTitle} />
        {contentListRating === 'NOT_SAFE_FOR_WORK' ? <NsfwLabel /> : null}
      </div>
      <TextLabel displayText={contentListAuthor.username} />
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
  extends Pick<
    ContentItem,
    'contentItemTitle' | 'contentItemAuthor' | 'contentItemLinks'
  > {}

function ContentListItem(props: ContentListItemProps) {
  const { contentItemTitle, contentItemAuthor, contentItemLinks } = props
  const styles = useContentItemStyles()
  return (
    <div className={styles.itemContainer}>
      <div className={styles.itemDivider}></div>
      <TextLabel displayText={contentItemTitle} />
      <TextLabel displayText={contentItemAuthor} />
      <div className={styles.linksContainer}>
        <LinkLabel
          displayText={contentItemLinks[0].contentLinkHostName}
          linkHref={contentItemLinks[0].contentLinkUrl}
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
