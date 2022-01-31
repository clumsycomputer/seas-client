import { MoreVert } from '@mui/icons-material'
import {
  Box,
  Divider,
  Stack,
  Typography,
  Link,
  IconButton,
  List,
  ListItem,
} from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LoggedInUserPage, LoggedOutUserPage } from '../components/Page'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { ContentList } from '../models/ContentList'

export function ContentListPage() {
  const currentUser = useCurrentUser()
  const routeParams = useParams()
  const [pageBody, setPageBody] = useState<ReactNode>(null)
  useEffect(() => {
    fetch(`http://localhost:8000/content-lists/${routeParams.contentListId}/`)
      .then((getContentListResponse) => getContentListResponse.json())
      .then((contentListData: unknown) => {
        const contentList = contentListData as ContentList
        setPageBody(
          <Stack padding={1}>
            <Box padding={1} display={'flex'} flexDirection={'row'}>
              <Stack>
                <Box
                  display={'flex'}
                  flexDirection={'row'}
                  alignItems={'baseline'}
                >
                  <Box>
                    <Typography variant={'subtitle2'} fontWeight={600}>
                      {contentList.contentListTitle}
                    </Typography>
                  </Box>
                  <Box paddingLeft={1}>
                    <Typography
                      variant={'caption'}
                      color={'error.main'}
                      fontWeight={500}
                    >
                      nsfw
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Link href={`/${contentList.contentListAuthor.id}`}>
                    <Typography variant={'body2'} fontWeight={500}>
                      {contentList.contentListAuthor.username}
                    </Typography>
                  </Link>
                </Box>
              </Stack>
              <Box flexGrow={1} />
              <Box paddingRight={1}>
                <IconButton>
                  <MoreVert />
                </IconButton>
              </Box>
            </Box>
            <Divider />
            <List>
              {contentList.contentListItems.map(
                (someContentItem, contentItemIndex) => {
                  return (
                    <ListItem key={`${contentItemIndex}`}>
                      <Stack>
                        <Box>
                          <Typography variant={'subtitle2'} fontWeight={600}>
                            {someContentItem.contentItemTitle}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant={'body2'} fontWeight={500}>
                            {someContentItem.contentItemAuthor}
                          </Typography>
                        </Box>
                        <Stack>
                          {someContentItem.contentItemLinks.map(
                            (someContentLink, contentLinkIndex) => {
                              return (
                                <Box key={`${contentLinkIndex}`}>
                                  <Link href={someContentLink.contentLinkUrl}>
                                    <Typography
                                      variant={'body2'}
                                      fontWeight={500}
                                    >
                                      {someContentLink.contentLinkHostName}
                                    </Typography>
                                  </Link>
                                </Box>
                              )
                            }
                          )}
                        </Stack>
                      </Stack>
                    </ListItem>
                  )
                }
              )}
            </List>
          </Stack>
        )
      })
  }, [])
  return currentUser == null ? (
    <LoggedOutUserPage pageBody={pageBody} />
  ) : (
    <LoggedInUserPage currentUser={currentUser} pageBody={pageBody} />
  )
}
// import { Fragment, ReactNode, useEffect, useState } from 'react'
// // import { createUseStyles } from 'react-jss'
// import { useNavigate, useParams } from 'react-router-dom'
// // import { AppTheme } from '../appTheme'
// import { ActionButton } from '../components/ActionButton'
// import { LinkLabel } from '../components/LinkLabel'
// import { NsfwLabel } from '../components/NsfwLabel'
// import { PageContainer } from '../components/PageContainer'
// import { TextLabel } from '../components/TextLabel'
// import { useCurrentUser } from '../hooks/useCurrentUser'
// import { ContentItem, ContentList } from '../models/ContentList'

// export interface ContentListPageProps {}

// export function ContentListPage(props: ContentListPageProps) {
//   // const styles = useContentListPageStyles()
//   const navigateToPage = useNavigate()
//   const currentUser = useCurrentUser()
//   const routeParams = useParams()
//   const [pageContent, setPageContent] = useState<ReactNode>(
//     <div>Loading...</div>
//   )
//   useEffect(() => {
//     fetch(`http://localhost:8000/content-lists/${routeParams.contentListId}`)
//       .then((getContentListResponse) => getContentListResponse.json())
//       .then((contentListResponseData: unknown) => {
//         const contentList = contentListResponseData as ContentList
//         const currentUserOwnsList =
//           currentUser?.id === contentList.contentListAuthor.id
//         setPageContent(
//           <Fragment>
//             <ContentListHeader
//               contentListTitle={contentList.contentListTitle}
//               contentListAuthor={contentList.contentListAuthor}
//               contentListRating={contentList.contentListRating}
//               editListButton={
//                 currentUserOwnsList ? (
//                   <ActionButton
//                     disabled={false}
//                     buttonLabel={'Edit List'}
//                     onClick={() => {
//                       navigateToPage(`/content-list/${contentList.id}/edit`)
//                     }}
//                   />
//                 ) : null
//               }
//             />
//             {contentList.contentListItems.map(
//               (someContentItem, someContentItemIndex) => {
//                 return (
//                   <ContentListItem
//                     key={`${someContentItemIndex}`}
//                     contentItemTitle={someContentItem.contentItemTitle}
//                     contentItemAuthor={someContentItem.contentItemAuthor}
//                     contentItemLinks={someContentItem.contentItemLinks}
//                   />
//                 )
//               }
//             )}
//             <div
//             // className={styles.footerSpacer}
//             />
//           </Fragment>
//         )
//       })
//   }, [])
//   return <PageContainer>{pageContent}</PageContainer>
// }

// // const useContentListPageStyles = createUseStyles((theme: AppTheme) => {
// //   return {
// //     pageContainer: {
// //       padding: theme.spacing(1),
// //       display: 'flex',
// //       flexDirection: 'column',
// //     },
// //     footerSpacer: {
// //       height: theme.spacing(3),
// //     },
// //   }
// // })

// interface ContentListHeaderProps
//   extends Pick<
//     ContentList,
//     'contentListTitle' | 'contentListAuthor' | 'contentListRating'
//   > {
//   editListButton: ReactNode
// }

// function ContentListHeader(props: ContentListHeaderProps) {
//   const {
//     contentListTitle,
//     contentListAuthor,
//     contentListRating,
//     editListButton,
//   } = props
//   // const styles = useContentListHeaderStyles()
//   return (
//     <div
//     // className={styles.headerContainer}
//     >
//       <div
//       // className={styles.topRowContainer}
//       >
//         <TextLabel displayText={contentListTitle} />
//         {contentListRating === 'NOT_SAFE_FOR_WORK' ? <NsfwLabel /> : null}
//       </div>
//       <TextLabel displayText={contentListAuthor.username} />
//       {editListButton}
//     </div>
//   )
// }

// // const useContentListHeaderStyles = createUseStyles((theme: AppTheme) => {
// //   return {
// //     headerContainer: {
// //       display: 'flex',
// //       flexDirection: 'column',
// //     },
// //     topRowContainer: {
// //       display: 'flex',
// //       flexDirection: 'row',
// //     },
// //   }
// // })

// interface ContentListItemProps
//   extends Pick<
//     ContentItem,
//     'contentItemTitle' | 'contentItemAuthor' | 'contentItemLinks'
//   > {}

// function ContentListItem(props: ContentListItemProps) {
//   const { contentItemTitle, contentItemAuthor, contentItemLinks } = props
//   // const styles = useContentItemStyles()
//   return (
//     <div
//     // className={styles.itemContainer}
//     >
//       <div
//       // className={styles.itemDivider}
//       ></div>
//       <TextLabel displayText={contentItemTitle} />
//       <TextLabel displayText={contentItemAuthor} />
//       <div
//       // className={styles.linksContainer}
//       >
//         <LinkLabel
//           displayText={contentItemLinks[0].contentLinkHostName}
//           linkHref={contentItemLinks[0].contentLinkUrl}
//         />
//       </div>
//     </div>
//   )
// }

// // const useContentItemStyles = createUseStyles((theme: AppTheme) => {
// //   return {
// //     itemContainer: {
// //       paddingTop: theme.spacing(2),
// //       display: 'flex',
// //       flexDirection: 'column',
// //     },
// //     itemDivider: {
// //       height: 2,
// //       backgroundColor: theme.palette.lightGray,
// //       borderRadius: 2,
// //     },
// //     linksContainer: {
// //       display: 'flex',
// //       flexDirection: 'row',
// //       flexWrap: 'wrap',
// //     },
// //   }
// // })
