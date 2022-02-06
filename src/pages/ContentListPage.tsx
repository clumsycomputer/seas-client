import { MoreVert } from '@mui/icons-material'
import {
  Box,
  Divider,
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
import { useTask } from '../hooks/useTask'
import { ContentList } from '../models/ContentList'
import { SeasService } from '../services/SeasService'

export function ContentListPage() {
  const currentUser = useCurrentUser()
  const routeParams = useParams()
  const navigateToPage = useNavigate()
  const [getContentListState, getContentList] = useTask(async () => {
    const getContentListData = await SeasService.getContentList({
      contentListId: routeParams.contentListId!,
    })
    const contentList = getContentListData as ContentList
    return contentList
  })
  const [deleteContentListState, deleteContentList] = useTask(async () => {
    if (getContentListState.taskStatus === 'taskSuccessful') {
      const contentList = getContentListState.taskResult
      await SeasService.deleteContentList({
        authToken: currentUser!.authToken,
        contentListId: contentList.id,
      })
      navigateToPage(`/${currentUser!.id}`)
    }
  })
  const [pageBody, setPageBody] = useState<ReactNode>(null)
  useEffect(() => {
    getContentList()
  }, [routeParams.contentListId])
  useEffect(() => {
    if (getContentListState.taskStatus === 'taskSuccessful') {
      const contentList = getContentListState.taskResult
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
                    visibility={
                      contentList.contentListRating === 'NOT_SAFE_FOR_WORK'
                        ? 'visible'
                        : 'hidden'
                    }
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
            <Box>
              <Box visibility={currentUserCanEditList ? 'visible' : 'hidden'}>
                <MenuButton
                  buttonColor={'default'}
                  buttonIcon={<MoreVert />}
                  menuItems={[
                    {
                      children: 'Edit List',
                      onClick: () => {
                        navigateToPage(`/content-list/${contentList.id}/edit`)
                      },
                    },
                    {
                      children: 'Delete List',
                      onClick: () => {
                        deleteContentList()
                      },
                    },
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
    }
  }, [getContentListState])
  return currentUser == null ? (
    <LoggedOutUserPage pageBody={pageBody} />
  ) : (
    <LoggedInUserPage currentUser={currentUser} pageBody={pageBody} />
  )
}
