import { AddRounded, MoreVert } from '@mui/icons-material'
import {
  Box,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MenuButton } from '../components/MenuButton'
import { LoggedInUserPage, LoggedOutUserPage } from '../components/Page'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { UserProfile } from '../models/User'
import { SeasService } from '../services/SeasService'

export function UserProfilePage() {
  const routeParams = useParams()
  const navigateToPage = useNavigate()
  const currentUser = useCurrentUser()
  const [pageBody, setPageBody] = useState<ReactNode>(null)
  useEffect(() => {
    SeasService.getUserProfile({
      userId: routeParams.userId!,
    }).then((userProfileData: unknown) => {
      const userProfile = userProfileData as UserProfile
      const currentUserCanEditProfile = currentUser?.id === userProfile.id
      setPageBody(
        currentUserCanEditProfile ? (
          <EditableUserProfileDisplay
            userProfile={userProfile}
            navigateToCreateContentListPage={() => {
              navigateToPage(`/content-list/create`)
            }}
            navigateToEditContentListPage={(someContentList) => {
              navigateToPage(`/content-list/${someContentList.id}/edit`)
            }}
            deleteContentList={(someContentList) => {
              SeasService.deleteContentList({
                authToken: currentUser.authToken,
                contentListId: someContentList.id,
              }).then(() => {
                // todo refresh user profile
              })
            }}
          />
        ) : (
          <UserProfileDisplay
            userProfile={userProfile}
            createContentListButton={null}
            getContentListOptionsButton={() => null}
          />
        )
      )
    })
  }, [routeParams.userId])
  return currentUser === null ? (
    <LoggedOutUserPage pageBody={pageBody} />
  ) : (
    <LoggedInUserPage currentUser={currentUser} pageBody={pageBody} />
  )
}

interface EditableUserProfileDisplayProps
  extends Pick<UserProfileDisplayProps, 'userProfile'> {
  navigateToCreateContentListPage: () => void
  navigateToEditContentListPage: (
    someContentList: Parameters<
      UserProfileDisplayProps['getContentListOptionsButton']
    >[0]
  ) => void
  deleteContentList: (
    someContentList: Parameters<
      UserProfileDisplayProps['getContentListOptionsButton']
    >[0]
  ) => void
}

function EditableUserProfileDisplay(props: EditableUserProfileDisplayProps) {
  const {
    userProfile,
    navigateToCreateContentListPage,
    navigateToEditContentListPage,
    deleteContentList,
  } = props
  return (
    <UserProfileDisplay
      userProfile={userProfile}
      createContentListButton={
        <IconButton
          onClick={() => {
            navigateToCreateContentListPage()
          }}
        >
          <AddRounded />
        </IconButton>
      }
      getContentListOptionsButton={(someContentList) => (
        <MenuButton
          buttonColor={'default'}
          buttonIcon={<MoreVert />}
          menuItems={[
            {
              children: 'Edit List',
              onClick: () => {
                navigateToEditContentListPage(someContentList)
              },
            },
            {
              children: 'Delete List',
              onClick: () => {
                deleteContentList(someContentList)
              },
            },
          ]}
        />
      )}
    />
  )
}

interface UserProfileDisplayProps {
  userProfile: UserProfile
  createContentListButton: ReactNode
  getContentListOptionsButton: (
    someContentList: UserProfile['contentLists'][number],
    contentListIndex: number
  ) => ReactNode
}

function UserProfileDisplay(props: UserProfileDisplayProps) {
  const { userProfile, createContentListButton, getContentListOptionsButton } =
    props
  return (
    <Stack padding={1}>
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
        <Box padding={1} display={'flex'}>
          <Typography variant={'subtitle2'} fontWeight={600}>
            {userProfile.username}
          </Typography>
        </Box>
        <Box flexGrow={1} />
        <Box padding={1} display={'flex'}>
          <Box>{createContentListButton}</Box>
        </Box>
      </Box>
      <Divider />
      <List>
        {userProfile.contentLists.map((someContentList, contentListIndex) => {
          return (
            <ListItem
              key={`${contentListIndex}`}
              secondaryAction={
                <Box>
                  {getContentListOptionsButton(
                    someContentList,
                    contentListIndex
                  )}
                </Box>
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
                  <Typography variant={'subtitle2'} fontWeight={600}>
                    {someContentList.contentListTitle}
                  </Typography>
                </Link>
                <Typography
                  visibility={
                    someContentList.contentListRating === 'NOT_SAFE_FOR_WORK'
                      ? 'visible'
                      : 'hidden'
                  }
                  variant={'caption'}
                  color={'error.main'}
                  fontWeight={500}
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
}
