import {
  Box,
  Button,
  Divider,
  Link as MuiLink,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material'
import React, { ReactNode, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ErrorPageBody } from '../components/ErrorPageBody'
import { LoadingPageBody } from '../components/LoadingPageBody'
import { DenseMenuButton } from '../components/MenuButton'
import { UserPage } from '../components/Page'
import { getSeasServiceErrorMessage } from '../helpers/getSeasServiceErrorMessage'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useTask } from '../hooks/useTask'
import { UserProfile } from '../models/User'
import { SeasService } from '../services/SeasService'

export function UserProfilePage() {
  const routeParams = useParams()
  const navigateToPage = useNavigate()
  const currentUser = useCurrentUser()
  const [getUserProfileState, getUserProfile] = useTask(async () => {
    if (routeParams.username) {
      const userProfile = await SeasService.getUserProfile({
        username: routeParams.username,
      })
      return userProfile
    } else {
      throw new Error('wtf? getUserProfileState')
    }
  })
  const [deleteUserProfileState, deleteUserProfile] = useTask(
    async (
      api: Pick<Parameters<typeof SeasService.deleteContentList>[0], 'id'>
    ) => {
      const { id } = api
      if (currentUser) {
        await SeasService.deleteContentList({
          id,
          apiToken: currentUser.apiToken,
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
      currentUser.username === getUserProfileState.taskResult.username
    ) {
      setPageBody(
        <EditableUserProfileDisplay
          userProfile={getUserProfileState.taskResult}
          navigateToCreateContentListPage={() => {
            navigateToPage(
              `/${getUserProfileState.taskResult.username}/create`,
              {
                replace: true,
              }
            )
          }}
          navigateToEditContentListPage={(someContentList) => {
            navigateToPage(
              `/${getUserProfileState.taskResult.username}/${someContentList.contentListSlug}/${someContentList.id}/edit?cancel-route=${window.location.pathname}`,
              {
                replace: true,
              }
            )
          }}
          deleteContentList={(someContentList) => {
            deleteUserProfile({
              id: someContentList.id,
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
    } else if (getUserProfileState.taskStatus === 'taskError') {
      const seasServiceErrorMessage = getSeasServiceErrorMessage({
        someServiceError: getUserProfileState.taskError,
      })
      setPageBody(<ErrorPageBody errorMessage={seasServiceErrorMessage} />)
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
        <Button
          onClick={() => {
            navigateToCreateContentListPage()
          }}
        >
          Create List
        </Button>
      }
      getContentListOptionsButton={(someContentList) => (
        <DenseMenuButton
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
                  <MuiLink
                    component={Link}
                    replace={true}
                    to={`/${userProfile.username}/${someContentList.contentListSlug}/${someContentList.id}`}
                  >
                    <Typography variant={'subtitle2'} fontWeight={600}>
                      {someContentList.contentListTitle}
                    </Typography>
                  </MuiLink>
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
