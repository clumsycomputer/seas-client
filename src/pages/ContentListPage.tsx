import { MoreVert } from '@mui/icons-material'
import {
  Box,
  Divider,
  Link,
  List,
  ListItem,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MenuButton } from '../components/MenuButton'
import { LoggedInUserPage, LoggedOutUserPage } from '../components/Page'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { ContentList } from '../models/ContentList'
import { getContentList } from '../services/SeasService'

export function ContentListPage() {
  const currentUser = useCurrentUser()
  const routeParams = useParams()
  const [pageBody, setPageBody] = useState<ReactNode>(null)
  useEffect(() => {
    getContentList({
      contentListId: routeParams.contentListId!,
    }).then((contentListData: unknown) => {
      const contentList = contentListData as ContentList
      const currentUserCanEditList =
        currentUser?.id === contentList.contentListAuthor.id
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
              <Box visibility={currentUserCanEditList ? 'visible' : 'hidden'}>
                <MenuButton
                  buttonColor={'default'}
                  buttonIcon={<MoreVert />}
                  menuItems={[
                    <MenuItem key={'edit-list-item'}>Edit List</MenuItem>,
                    <MenuItem key={'delete-list-item'}>Delete List</MenuItem>,
                  ]}
                />
              </Box>
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
  }, [routeParams.contentListId])
  return currentUser == null ? (
    <LoggedOutUserPage pageBody={pageBody} />
  ) : (
    <LoggedInUserPage currentUser={currentUser} pageBody={pageBody} />
  )
}
