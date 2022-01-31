import {
  AddRounded,
  DeleteRounded,
  EditRounded,
  MoreVert,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LoggedInUserPage, LoggedOutUserPage } from '../components/Page'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { UserProfile } from '../models/User'

export function UserProfilePage() {
  const routeParams = useParams()
  const currentUser = useCurrentUser()
  const [pageBody, setPageBody] = useState<ReactNode>(null)
  useEffect(() => {
    fetch(`http://localhost:8000/user-profiles/${routeParams.userId}`)
      .then((getUserProfileResponse) => getUserProfileResponse.json())
      .then((userProfileData: unknown) => {
        const userProfile = userProfileData as UserProfile
        setPageBody(
          <Stack padding={1}>
            <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
              <Box padding={1} display={'flex'}>
                <Typography variant={'subtitle2'} padding={1 / 2}>
                  {userProfile.username}
                </Typography>
              </Box>
              <Box flexGrow={1} />
              <Box padding={1} paddingRight={2} display={'flex'}>
                <IconButton>
                  <AddRounded />
                </IconButton>
              </Box>
            </Box>
            <Divider />
            <List>
              {userProfile.contentLists.map((someContentList) => {
                return (
                  <ListItem
                    // divider={true}
                    secondaryAction={
                      <IconButton>
                        <MoreVert />
                      </IconButton>
                    }
                  >
                    <Box
                      padding={1}
                      paddingLeft={0}
                      display={'flex'}
                      flexDirection={'row'}
                      flexWrap={'wrap'}
                      alignItems={'baseline'}
                    >
                      <Link href={`/content-list/${someContentList.id}`}>
                        <Typography variant={'body1'}>
                          {someContentList.contentListTitle}
                        </Typography>
                      </Link>
                      <Typography
                        variant={'body2'}
                        color={'error.main'}
                        paddingLeft={1}
                      >
                        nsfw
                      </Typography>
                    </Box>
                  </ListItem>
                )
              })}
            </List>
          </Stack>
        )
      })
  }, [])
  return currentUser === null ? (
    <LoggedOutUserPage pageBody={pageBody} />
  ) : (
    <LoggedInUserPage currentUser={currentUser} pageBody={pageBody} />
  )
}
// import { Fragment, ReactNode, useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { ActionButton } from '../components/ActionButton'
// import { LinkLabel } from '../components/LinkLabel'
// import { NsfwLabel } from '../components/NsfwLabel'
// import { PageContainer } from '../components/PageContainer'
// import { TextLabel } from '../components/TextLabel'
// import { useCurrentUser } from '../hooks/useCurrentUser'
// import { UserProfile } from '../models/User'

// export interface UserProfilePageProps {}

// export function UserProfilePage(props: UserProfilePageProps) {
//   const currentUser = useCurrentUser()
//   // const styles = useStyles()
//   const routeParams = useParams()
//   const navigateToPage = useNavigate()
//   const [pageContent, setPageContent] = useState<ReactNode>(
//     <div>Loading...</div>
//   )
//   useEffect(() => {
// fetch(`http://localhost:8000/users/${routeParams.userId}`)
//   .then((getUserProfileResponse) => getUserProfileResponse.json())
//   .then((userProfileData: unknown) => {
//     const userProfile = userProfileData as UserProfile
//     const currentUserOwnsProfile = currentUser?.id === userProfile.id
//     setPageContent(
//       <Fragment>
//         <TextLabel displayText={userProfile.username} />
//         {currentUserOwnsProfile ? (
//           <ActionButton
//             disabled={false}
//             buttonLabel={'create list'}
//             onClick={() => {
//               navigateToPage('/content-list/create')
//             }}
//           />
//         ) : null}
//         {userProfile.contentLists.map((someContentList) => {
//           return (
//             <div
//               key={`${someContentList.id}`}
//               // className={styles.contentListItemContainer}
//             >
//               <div
//               // className={styles.contentListItemDivider}
//               />
//               <div
//               // className={styles.contentListHeaderRow}
//               >
//                 <div
//                 // className={styles.contentListTitleContainer}
//                 >
//                   <TextLabel
//                     displayText={someContentList.contentListTitle}
//                   />
//                   {someContentList.contentListRating ===
//                   'NOT_SAFE_FOR_WORK' ? (
//                     <NsfwLabel />
//                   ) : null}
//                 </div>
//                 <div
//                 // className={styles.viewListActionContainer}
//                 >
//                   <LinkLabel
//                     displayText={'view list'}
//                     linkHref={`/content-list/${someContentList.id}`}
//                   />
//                 </div>
//               </div>
//             </div>
//           )
//         })}
//       </Fragment>
//     )
//       })
//   }, [])
//   return <PageContainer>{pageContent}</PageContainer>
// }

// // const useStyles = makeStyles((appTheme: Theme) => {
// //   return createStyles({
// //     contentListItemContainer: {
// //       width: '100%',
// //       paddingTop: appTheme.spacing(2),
// //       display: 'flex',
// //       flexDirection: 'column',
// //     },
// //     contentListHeaderRow: {
// //       display: 'flex',
// //       flexDirection: 'row',
// //     },
// //     contentListTitleContainer: {
// //       flexGrow: 1,
// //       display: 'flex',
// //       flexDirection: 'row',
// //     },
// //     contentListItemDivider: {
// //       height: 2,
// //       backgroundColor: appTheme.palette.divider,
// //       borderRadius: 2,
// //     },
// //     viewListActionContainer: {
// //       paddingLeft: appTheme.spacing(1),
// //       paddingRight: appTheme.spacing(1),
// //     },
// //   })
// // })
