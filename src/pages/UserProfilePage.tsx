import { AddRounded, MoreVert } from '@mui/icons-material'
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
  Link as MuiLink,
} from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { LoadingPageBody } from '../components/LoadingPageBody'
import { MenuButton } from '../components/MenuButton'
import { UserPage } from '../components/Page'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useTask } from '../hooks/useTask'
import { UserProfile } from '../models/User'
import { SeasService } from '../services/SeasService'

export function UserProfilePage() {
  const routeParams = useParams()
  const navigateToPage = useNavigate()
  const currentUser = useCurrentUser()
  const [getUserProfileState, getUserProfile] = useTask(async () => {
    const userProfile = await SeasService.getUserProfile({
      userId: parseInt(routeParams.userId!),
    })
    return userProfile
  })
  const [deleteUserProfileState, deleteUserProfile] = useTask(
    async (
      api: Pick<
        Parameters<typeof SeasService.deleteContentList>[0],
        'contentListId'
      >
    ) => {
      const { contentListId } = api
      if (currentUser) {
        await SeasService.deleteContentList({
          contentListId,
          authToken: currentUser.authToken,
        })
      }
    }
  )
  useEffect(() => {
    getUserProfile()
  }, [routeParams.userId])
  useEffect(() => {
    if (deleteUserProfileState.taskStatus === 'taskSuccessful') {
      getUserProfile()
    }
  }, [deleteUserProfileState])
  const [pageBody, setPageBody] = useState<ReactNode>(null)
  useEffect(() => {
    if (
      currentUser &&
      getUserProfileState.taskStatus === 'taskSuccessful' &&
      currentUser.id === getUserProfileState.taskResult.id
    ) {
      setPageBody(
        <EditableUserProfileDisplay
          userProfile={getUserProfileState.taskResult}
          navigateToCreateContentListPage={() => {
            navigateToPage(`/content-list/create`, {
              replace: true,
            })
          }}
          navigateToEditContentListPage={(someContentList) => {
            navigateToPage(
              `/content-list/${someContentList.id}/edit?cancel-route=${window.location.pathname}`,
              {
                replace: true,
              }
            )
          }}
          deleteContentList={(someContentList) => {
            deleteUserProfile({
              contentListId: someContentList.id,
            })
          }}
        />
      )
    } else if (getUserProfileState.taskStatus === 'taskSuccessful') {
      setPageBody(
        <UserProfileDisplay
          createContentListButton={null}
          getContentListOptionsButton={() => null}
          userProfile={getUserProfileState.taskResult}
        />
      )
    } else if (
      (getUserProfileState.taskStatus === 'taskNotInitialized' ||
        getUserProfileState.taskStatus === 'taskActive') &&
      deleteUserProfileState.taskStatus === 'taskNotInitialized'
    ) {
      setPageBody(<LoadingPageBody />)
    }
  }, [getUserProfileState])
  return <UserPage currentUser={currentUser} pageBody={pageBody} />
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
        {userProfile.contentLists.length > 0 ? (
          userProfile.contentLists.map((someContentList, contentListIndex) => {
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
                  <Link
                    replace={true}
                    to={`/content-list/${someContentList.id}`}
                  >
                    <MuiLink>
                      <Typography variant={'subtitle2'} fontWeight={600}>
                        {someContentList.contentListTitle}
                      </Typography>
                    </MuiLink>
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
          })
        ) : (
          <ListItem>
            <Box
              paddingTop={8}
              flexGrow={1}
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Typography
                variant={'subtitle2'}
                color={'GrayText'}
                fontSize={14}
                fontStyle={'italic'}
              >
                No Content Lists
              </Typography>
            </Box>
          </ListItem>
        )}
      </List>
    </Stack>
  )
}
