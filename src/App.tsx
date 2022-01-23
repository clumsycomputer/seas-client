import { createUseStyles } from 'react-jss'
import { AppTheme } from './appTheme'

export default App

function App() {
  const styles = useStyles()
  return (
    <ContentListPage
      contentList={{
        contentListId: 'aaa',
        contentListTitle: 'electronic music #1',
        contentListRating: 'notSafeForWork',
        contentListCurator: {
          curatorId: '0',
          curatorUsername: 'jmath',
        },
        contentListItems: [
          {
            contentId: '0',
            contentTitle: 'Los Angeles',
            contentProducer: 'Totally Enormous Extinct Dinosaurs',
            contentLinks: [
              {
                contentHostName: 'youtube',
                contentHref: 'todo',
              },
              {
                contentHostName: 'spotify',
                contentHref: 'todo',
              },
            ],
          },
          {
            contentId: '7',
            contentTitle: 'Das Wort',
            contentProducer: 'DJ Koze',
            contentLinks: [
              {
                contentHostName: 'youtube',
                contentHref: 'todo',
              },
              {
                contentHostName: 'spotify',
                contentHref: 'todo',
              },
            ],
          },
          {
            contentId: '11',
            contentTitle: 'Sooner',
            contentProducer: 'WhoMadeWho',
            contentLinks: [
              {
                contentHostName: 'youtube',
                contentHref: 'https://youtu.be/UnJ8h5BKwQs',
              },
              {
                contentHostName: 'spotify',
                contentHref:
                  'https://open.spotify.com/track/4764iXim5VO3mVjHFcuj3b?si=0d673f3dfbf844d2',
              },
            ],
          },
          {
            contentId: '8',
            contentTitle: 'All I Ever Need',
            contentProducer: 'Caribou',
            contentLinks: [
              {
                contentHostName: 'youtube',
                contentHref: 'https://youtu.be/PFcdXvJIfSM',
              },
              {
                contentHostName: 'spotify',
                contentHref:
                  'https://open.spotify.com/track/3TWq4sElJorDh8TGa81epv?si=185ef70d8fb74989',
              },
            ],
          },
          {
            contentId: '3',
            contentTitle: 'Love Divide',
            contentProducer: 'Ross From Friends',
            contentLinks: [
              {
                contentHostName: 'youtube',
                contentHref: 'todo',
              },
              {
                contentHostName: 'spotify',
                contentHref: 'todo',
              },
            ],
          },
          {
            contentId: '12',
            contentTitle: 'Such A Bad Way',
            contentProducer: 'Against All Logic',
            contentLinks: [
              {
                contentHostName: 'youtube',
                contentHref: 'https://youtu.be/aSgezZ4fC1Y',
              },
              {
                contentHostName: 'spotify',
                contentHref:
                  'https://open.spotify.com/track/39rvm2XzKyw4dsGLKvdDQV?si=73b154464e244a88',
              },
            ],
          },
          {
            contentId: '9',
            contentTitle: 'Turn It All Down',
            contentProducer: 'Bibio',
            contentLinks: [
              {
                contentHostName: 'youtube',
                contentHref: 'https://youtu.be/g7vwM8p2XBE',
              },
              {
                contentHostName: 'spotify',
                contentHref:
                  'https://open.spotify.com/track/53dIRHHKpv6WXHMQRhiltQ?si=46742748b391425b',
              },
            ],
          },
          {
            contentId: '3',
            contentTitle: 'Hustler',
            contentProducer: 'Simian Mobile Disco',
            contentLinks: [
              {
                contentHostName: 'youtube',
                contentHref: 'todo',
              },
              {
                contentHostName: 'spotify',
                contentHref: 'todo',
              },
            ],
          },
          {
            contentId: '13',
            contentTitle: 'Topdown',
            contentProducer: 'Channel Tres',
            contentLinks: [
              {
                contentHostName: 'youtube',
                contentHref: 'https://youtu.be/8pReEUxHxJM',
              },
              {
                contentHostName: 'spotify',
                contentHref:
                  'https://open.spotify.com/track/6KflfPD0qIbbB1PQyAHla5?si=3679339474ef44b2',
              },
            ],
          },
          {
            contentId: '14',
            contentTitle: 'Let U No',
            contentProducer: 'Dj Rashad',
            contentLinks: [
              {
                contentHostName: 'youtube',
                contentHref: 'todo',
              },
              {
                contentHostName: 'spotify',
                contentHref: 'todo',
              },
            ],
          },
          // {
          //   contentId: '3',
          //   contentTitle: 'Love Just Died Tonight',
          //   contentProducer: 'Bastien Keb',
          //   contentLinks: [
          //     {
          //       contentHostName: 'youtube',
          //       contentHref: 'todo',
          //     },
          //     {
          //       contentHostName: 'spotify',
          //       contentHref: 'todo',
          //     },
          //   ],
          // },
          // {
          //   contentId: '2',
          //   contentTitle: 'The Son of the Sun',
          //   contentProducer: 'The 2 Bears',
          //   contentLinks: [
          //     {
          //       contentHostName: 'youtube',
          //       contentHref: 'https://youtu.be/2jEf5FZyjVE',
          //     },
          //     {
          //       contentHostName: 'spotify',
          //       contentHref:
          //         'https://open.spotify.com/track/7300apJrwWCARQaJBRnBLi?si=0e0acfde527c4be2',
          //     },
          //   ],
          // },
        ],
      }}
    />
  )
}

const useStyles = createUseStyles((theme: AppTheme) => {
  return {
    pageContainer: {
      padding: theme.spacing(1),
    },
  }
})

interface ContentListPageProps {
  contentList: ContentList
}

function ContentListPage(props: ContentListPageProps) {
  const { contentList } = props
  const styles = useContentListPageStyles()
  return (
    <div className={styles.pageContainer}>
      <ContentListHeader
        contentListTitle={contentList.contentListTitle}
        contentListCurator={contentList.contentListCurator}
        contentListRating={contentList.contentListRating}
      />
      {contentList.contentListItems.map(
        (someContentItem, someContentItemIndex) => {
          return (
            <ContentItem
              key={`${someContentItemIndex}`}
              contentTitle={someContentItem.contentTitle}
              contentProducer={someContentItem.contentProducer}
              contentLinks={someContentItem.contentLinks}
            />
          )
        }
      )}
      <div className={styles.footerSpacer} />
    </div>
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
  const { contentListTitle, contentListCurator } = props
  const styles = useContentListHeaderStyles()
  return (
    <div className={styles.headerContainer}>
      <div className={styles.topRowContainer}>
        <TextLabel displayText={contentListTitle} />
        <NsfwLabel />
      </div>
      <TextLabel displayText={contentListCurator.curatorUsername} />
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

interface ContentItemProps
  extends Pick<
    ContentItem,
    'contentTitle' | 'contentProducer' | 'contentLinks'
  > {}

function ContentItem(props: ContentItemProps) {
  const { contentTitle, contentProducer, contentLinks } = props
  const styles = useContentItemStyles()
  return (
    <div className={styles.itemContainer}>
      <div className={styles.itemDivider}></div>
      <TextLabel displayText={contentTitle} />
      <TextLabel displayText={contentProducer} />
      <div className={styles.linksContainer}>
        {contentLinks.map((someContentLink, contentLinkIndex) => {
          return (
            <LinkLabel
              key={`${contentLinkIndex}`}
              displayText={someContentLink.contentHostName}
              linkHref={someContentLink.contentHref}
            />
          )
        })}
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

interface TextLabelProps {
  displayText: string
}

function TextLabel(props: TextLabelProps) {
  const { displayText } = props
  const styles = useTextLabelStyles()
  return (
    <div className={styles.labelContainer}>
      <div className={styles.labelText}>{displayText}</div>
    </div>
  )
}

const useTextLabelStyles = createUseStyles((theme: AppTheme) => {
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

interface NsfwLabelProps {}

function NsfwLabel(props: NsfwLabelProps) {
  const styles = useNsfwLabelStyles()
  return (
    <div className={styles.labelContainer}>
      <div className={styles.labelText}>nsfw</div>
    </div>
  )
}

const useNsfwLabelStyles = createUseStyles((theme: AppTheme) => {
  return {
    labelContainer: {
      paddingLeft: theme.spacing(1),
      paddingTop: theme.spacing(1),
      display: 'flex',
      flexDirection: 'row',
    },
    labelText: {
      padding: theme.spacing(1 / 5),
      borderStyle: 'solid',
      borderRadius: theme.spacing(1 / 2),
      borderWidth: 1,
      borderColor: theme.palette.red,
      fontWeight: 'bold',
      color: theme.palette.red,
    },
  }
})

interface LinkLabelProps {
  displayText: string
  linkHref: string
}

function LinkLabel(props: LinkLabelProps) {
  const { displayText, linkHref } = props
  const styles = useLinkLabelStyles()
  return (
    <div className={styles.labelContainer}>
      <a className={styles.labelText} href={linkHref}>
        {displayText}
      </a>
    </div>
  )
}

const useLinkLabelStyles = createUseStyles((theme: AppTheme) => {
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
    },
  }
})

interface ContentList {
  contentListId: string
  contentListTitle: string
  contentListCurator: ContentCurator
  contentListRating: ContentListRating
  contentListItems: Array<ContentItem>
}

type ContentListRating = 'safeForWork' | 'notSafeForWork'

interface ContentCurator {
  curatorId: string
  curatorUsername: string
}

interface ContentItem {
  contentId: string
  contentTitle: string
  contentProducer: string
  contentLinks: Array<{
    contentHostName: string
    contentHref: string
  }>
}
