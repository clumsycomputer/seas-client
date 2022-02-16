import { MoreVert } from '@mui/icons-material'
import {
  Box,
  Divider,
  List,
  ListItem,
  Stack,
  Typography,
  Link as MuiLink,
  useTheme,
} from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { LoadingPageBody } from '../components/LoadingPageBody'
import { MenuButton } from '../components/MenuButton'
import { UserPage } from '../components/Page'
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
      contentListId: parseInt(routeParams.contentListId!),
    })
    const contentList = getContentListData as ContentList
    return contentList
  })
  const [deleteContentListState, deleteContentList] = useTask(async () => {
    if (currentUser && getContentListState.taskStatus === 'taskSuccessful') {
      const contentList = getContentListState.taskResult
      await SeasService.deleteContentList({
        apiToken: currentUser.apiToken,
        contentListId: contentList.id,
      })
    }
  })
  useEffect(() => {
    getContentList()
  }, [routeParams.contentListId])
  const [pageBody, setPageBody] = useState<ReactNode>(null)
  useEffect(() => {
    if (
      currentUser &&
      getContentListState.taskStatus === 'taskSuccessful' &&
      currentUser.id === getContentListState.taskResult.contentListAuthor.id
    ) {
      setPageBody(
        <EditableContentListPageBody
          contentList={getContentListState.taskResult}
          deleteContentList={deleteContentList}
          navigateToEditContentListPage={() => {
            navigateToPage(
              `/content-list/${getContentListState.taskResult.id}/edit?cancel-route=${window.location.pathname}`,
              {
                replace: true,
              }
            )
          }}
        />
      )
    } else if (getContentListState.taskStatus === 'taskSuccessful') {
      setPageBody(
        <ContentListPageBody
          editContentListMenuButton={null}
          contentList={getContentListState.taskResult}
        />
      )
    } else {
      setPageBody(<LoadingPageBody />)
    }
  }, [getContentListState])
  useEffect(() => {
    if (currentUser && deleteContentListState.taskStatus === 'taskSuccessful') {
      navigateToPage(`/${currentUser.id}`, {
        replace: true,
      })
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
        <MenuButton
          buttonColor={'default'}
          buttonIcon={<MoreVert />}
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
              to={`/${contentList.contentListAuthor.id}`}
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
