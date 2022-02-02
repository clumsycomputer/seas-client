import { AddRounded, MoreVert } from '@mui/icons-material'
import {
  Box,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MenuButton } from '../components/MenuButton'
import { LoggedInUserPage, LoggedOutUserPage } from '../components/Page'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { UserProfile } from '../models/User'
import { getUserProfile } from '../services/SeasService'

export function UserProfilePage() {
  const routeParams = useParams()
  const navigateSite = useNavigate()
  const currentUser = useCurrentUser()
  const [pageBody, setPageBody] = useState<ReactNode>(null)
  useEffect(() => {
    getUserProfile({
      userId: routeParams.userId!,
    }).then((userProfileData: unknown) => {
      const userProfile = userProfileData as UserProfile
      const currentUserCanEditProfile = currentUser?.id === userProfile.id
      setPageBody(
        <Stack padding={1}>
          <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
            <Box padding={1} display={'flex'}>
              <Typography variant={'subtitle2'} fontWeight={600}>
                {userProfile.username}
              </Typography>
            </Box>
            <Box flexGrow={1} />
            <Box padding={1} paddingRight={2} display={'flex'}>
              <Box
                visibility={currentUserCanEditProfile ? 'visible' : 'hidden'}
              >
                <IconButton
                  onClick={() => {
                    navigateSite('/content-list/create')
                  }}
                >
                  <AddRounded />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Divider />
          <List>
            {userProfile.contentLists.map(
              (someContentList, contentListIndex) => {
                return (
                  <ListItem
                    key={`${contentListIndex}`}
                    secondaryAction={
                      <Box
                        visibility={
                          currentUserCanEditProfile ? 'visible' : 'hidden'
                        }
                      >
                        <MenuButton
                          buttonColor={'default'}
                          buttonIcon={<MoreVert />}
                          menuItems={[
                            <MenuItem key={'edit-list-item'}>
                              Edit List
                            </MenuItem>,
                            <MenuItem key={'delete-list-item'}>
                              Delete List
                            </MenuItem>,
                          ]}
                        />
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
              }
            )}
          </List>
        </Stack>
      )
    })
  }, [routeParams.userId])
  return currentUser === null ? (
    <LoggedOutUserPage pageBody={pageBody} />
  ) : (
    <LoggedInUserPage currentUser={currentUser} pageBody={pageBody} />
  )
}
