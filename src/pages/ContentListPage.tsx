import {
  Box,
  Divider,
  IconButton,
  Link as MuiLink,
  List,
  ListItem,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ErrorPageBody } from '../components/ErrorPageBody'
import { LoadingPageBody } from '../components/LoadingPageBody'
import { DenseMenuButton } from '../components/MenuButton'
import { UserPage } from '../components/Page'
import { getSeasServiceErrorMessage } from '../helpers/getSeasServiceErrorMessage'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useTask } from '../hooks/useTask'
import { ContentList } from '../models/ContentList'
import { SeasService } from '../services/SeasService'

export function ContentListPage() {
  const currentUser = useCurrentUser()
  const routeParams = useParams()
  const navigateToPage = useNavigate()
  const [getContentListState, getContentList] = useTask(async () => {
    if (routeParams.id) {
      const getContentListData = await SeasService.getContentList({
        id: routeParams.id,
      })
      const contentList = getContentListData as ContentList
      return contentList
    } else {
      throw new Error('wtf? getContentListState')
    }
  })
  const [deleteContentListState, deleteContentList] = useTask(async () => {
    if (currentUser && getContentListState.taskStatus === 'taskSuccessful') {
      const contentList = getContentListState.taskResult
      await SeasService.deleteContentList({
        apiToken: currentUser.apiToken,
        id: contentList.id,
      })
    }
  })
  useEffect(() => {
    getContentList()
  }, [routeParams.id])
  const [pageBody, setPageBody] = useState<ReactNode>(null)
  useEffect(() => {
    if (
      currentUser &&
      getContentListState.taskStatus === 'taskSuccessful' &&
      currentUser.username ===
        getContentListState.taskResult.contentListAuthor.username
    ) {
      setPageBody(
        <EditableContentListPageBody
          contentList={getContentListState.taskResult}
          deleteContentList={deleteContentList}
          navigateToEditContentListPage={() => {
            if (routeParams.username) {
              navigateToPage(
                `/${routeParams.username}/${getContentListState.taskResult.contentListSlug}/${getContentListState.taskResult.id}/edit?cancel-route=${window.location.pathname}`,
                {
                  replace: true,
                }
              )
            }
          }}
        />
      )
    } else if (getContentListState.taskStatus === 'taskSuccessful') {
      setPageBody(
        <ContentListPageBody
          editContentListMenuButton={
            <IconButton sx={{ visibility: 'hidden' }} />
          }
          contentList={getContentListState.taskResult}
        />
      )
    } else if (getContentListState.taskStatus === 'taskActive') {
      setPageBody(<LoadingPageBody />)
    } else if (getContentListState.taskStatus === 'taskError') {
      const seasServiceErrorMessage = getSeasServiceErrorMessage({
        someServiceError: getContentListState.taskError,
      })
      setPageBody(<ErrorPageBody errorMessage={seasServiceErrorMessage} />)
    }
  }, [getContentListState])
  useEffect(() => {
    if (
      getContentListState.taskStatus === 'taskSuccessful' &&
      deleteContentListState.taskStatus === 'taskSuccessful'
    ) {
      navigateToPage(
        `/${getContentListState.taskResult.contentListAuthor.username}`,
        {
          replace: true,
        }
      )
    }
  }, [deleteContentListState])
  return <UserPage currentUser={currentUser} pageBody={pageBody} />
}

interface EditableContentPageBodyProps
  extends Pick<ContentListPageBodyProps, 'contentList'> {
  navigateToEditContentListPage: () => void
  deleteContentList: () => void
}

function EditableContentListPageBody(props: EditableContentPageBodyProps) {
  const { contentList, navigateToEditContentListPage, deleteContentList } =
    props
  return (
    <ContentListPageBody
      contentList={contentList}
      editContentListMenuButton={
        <DenseMenuButton
          menuItems={[
            {
              children: 'Edit List',
              onClick: () => {
                navigateToEditContentListPage()
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
      }
    />
  )
}

interface ContentListPageBodyProps {
  contentList: ContentList
  editContentListMenuButton: ReactNode
}

function ContentListPageBody(props: ContentListPageBodyProps) {
  const { contentList, editContentListMenuButton } = props
  const theme = useTheme()
  return (
    <Stack padding={1}>
      <Box padding={1} display={'flex'} flexDirection={'row'}>
        <Stack>
          <Box display={'flex'} flexDirection={'row'} alignItems={'baseline'}>
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
            <MuiLink
              component={Link}
              replace={true}
              to={`/${contentList.contentListAuthor.username}`}
            >
              <Typography variant={'body2'} fontWeight={500}>
                {contentList.contentListAuthor.username}
              </Typography>
            </MuiLink>
          </Box>
        </Stack>
        <Box flexGrow={1} />
        <Box>
          <Box>{editContentListMenuButton}</Box>
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
                            <MuiLink href={someContentLink.contentLinkUrl}>
                              <Typography variant={'body2'} fontWeight={500}>
                                {someContentLink.contentLinkHostName}
                              </Typography>
                            </MuiLink>
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
