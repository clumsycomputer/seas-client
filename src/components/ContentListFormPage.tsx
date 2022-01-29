import { createUseStyles } from 'react-jss'
import { AppTheme } from '../appTheme'
import { ContentList } from '../models/ContentList'
import { ActionButton, ActionButtonProps } from './ActionButton'
import { PageContainer } from './PageContainer'
import { PageHeader } from './PageHeader'
import { TextField } from './TextField'

export interface ContentListFormPageProps {
  formTitle: string
  formActions: Array<ActionButtonProps>
  formState: Pick<
    ContentList,
    'contentListTitle' | 'contentListRating' | 'contentListItems'
  >
  setFormState: (
    value: React.SetStateAction<
      Pick<
        ContentList,
        'contentListTitle' | 'contentListRating' | 'contentListItems'
      >
    >
  ) => void
}

export function ContentListFormPage(props: ContentListFormPageProps) {
  const { formTitle, formState, setFormState, formActions } = props
  const styles = useStyles()
  return (
    <PageContainer>
      <PageHeader pageTitle={formTitle} />
      <form className={styles.formInputsContainer}>
        <div className={styles.titleRowContainer}>
          <TextField
            fieldLabel={'List Title:'}
            value={formState.contentListTitle}
            onChange={(someChangeEvent) => {
              setFormState({
                ...formState,
                contentListTitle: someChangeEvent.target.value,
              })
            }}
          />
          <CheckboxField
            fieldLabel={'Nsfw:'}
            checked={formState.contentListRating === 'NOT_SAFE_FOR_WORK'}
            onChange={(someChangeEvent) => {
              setFormState({
                ...formState,
                contentListRating:
                  someChangeEvent.target.checked === true
                    ? 'NOT_SAFE_FOR_WORK'
                    : 'SAFE_FOR_WORK',
              })
            }}
          />
        </div>
        {formState.contentListItems.map((someContentItem, contentItemIndex) => {
          return (
            <div className={styles.contentItemContainer}>
              <div className={styles.contentItemDivider} />
              <div className={styles.contentItemSubFormContainer}>
                <div className={styles.contentItemFieldsContainer}>
                  <TextField
                    fieldLabel={'Content Title:'}
                    value={someContentItem.contentItemTitle}
                    onChange={(someChangeEvent) => {
                      const nextContentListItems = [
                        ...formState.contentListItems,
                      ]
                      nextContentListItems.splice(contentItemIndex, 1, {
                        ...someContentItem,
                        contentItemTitle: someChangeEvent.target.value,
                      })
                      setFormState({
                        ...formState,
                        contentListItems: nextContentListItems,
                      })
                    }}
                  />
                  <TextField
                    fieldLabel={'Content Author:'}
                    value={someContentItem.contentItemAuthor}
                    onChange={(someChangeEvent) => {
                      const nextContentListItems = [
                        ...formState.contentListItems,
                      ]
                      nextContentListItems.splice(contentItemIndex, 1, {
                        ...someContentItem,
                        contentItemAuthor: someChangeEvent.target.value,
                      })
                      setFormState({
                        ...formState,
                        contentListItems: nextContentListItems,
                      })
                    }}
                  />
                  <TextField
                    fieldLabel={'Content Host:'}
                    value={
                      someContentItem.contentItemLinks[0].contentLinkHostName
                    }
                    onChange={(someChangeEvent) => {
                      const nextContentListItems = [
                        ...formState.contentListItems,
                      ]
                      nextContentListItems.splice(contentItemIndex, 1, {
                        ...someContentItem,
                        contentItemLinks: [
                          {
                            ...someContentItem.contentItemLinks[0],
                            contentLinkHostName: someChangeEvent.target.value,
                          },
                        ],
                      })
                      setFormState({
                        ...formState,
                        contentListItems: nextContentListItems,
                      })
                    }}
                  />
                  <TextField
                    fieldLabel={'Content Url:'}
                    value={someContentItem.contentItemLinks[0].contentLinkUrl}
                    onChange={(someChangeEvent) => {
                      const nextContentListItems = [
                        ...formState.contentListItems,
                      ]
                      nextContentListItems.splice(contentItemIndex, 1, {
                        ...someContentItem,
                        contentItemLinks: [
                          {
                            ...someContentItem.contentItemLinks[0],
                            contentLinkUrl: someChangeEvent.target.value,
                          },
                        ],
                      })
                      setFormState({
                        ...formState,
                        contentListItems: nextContentListItems,
                      })
                    }}
                  />
                </div>
                <div className={styles.contentItemActionsContainer}>
                  <ActionButton
                    buttonLabel={'- Remove Item'}
                    disabled={false}
                    onClick={() => {
                      const nextContentListItems = [
                        ...formState.contentListItems,
                      ]
                      nextContentListItems.splice(contentItemIndex, 1)
                      setFormState({
                        ...formState,
                        contentListItems: nextContentListItems,
                      })
                    }}
                  />
                  <ActionButton
                    buttonLabel={'↑ Move Item Up'}
                    disabled={contentItemIndex === 0}
                    onClick={() => {
                      const nextContentListItems = [
                        ...formState.contentListItems,
                      ]
                      nextContentListItems.splice(
                        contentItemIndex - 1,
                        0,
                        nextContentListItems.splice(contentItemIndex, 1)[0]
                      )
                      setFormState({
                        ...formState,
                        contentListItems: nextContentListItems,
                      })
                    }}
                  />
                  <ActionButton
                    buttonLabel={'↓ Move Item Down'}
                    disabled={
                      contentItemIndex === formState.contentListItems.length - 1
                    }
                    onClick={() => {
                      const nextContentListItems = [
                        ...formState.contentListItems,
                      ]
                      nextContentListItems.splice(
                        contentItemIndex + 1,
                        0,
                        nextContentListItems.splice(contentItemIndex, 1)[0]
                      )
                      setFormState({
                        ...formState,
                        contentListItems: nextContentListItems,
                      })
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
        <div className={styles.addContentItemButtonContainer}>
          <ActionButton
            buttonLabel={'+ Add Content Item'}
            disabled={false}
            onClick={() => {
              setFormState({
                ...formState,
                contentListItems: [
                  ...formState.contentListItems,
                  {
                    contentItemTitle: '',
                    contentItemAuthor: '',
                    contentItemLinks: [
                      {
                        contentLinkHostName: '',
                        contentLinkUrl: '',
                      },
                    ],
                  },
                ],
              })
            }}
          />
        </div>
        <div className={styles.formFooterContainer}>
          {formActions.map((someFormActionProps, formActionIndex) => {
            return (
              <ActionButton
                key={`${formActionIndex}`}
                {...someFormActionProps}
              />
            )
          })}
        </div>
      </form>
      <div className={styles.pageFooterSpacer} />
    </PageContainer>
  )
}

const useStyles = createUseStyles((appTheme: AppTheme) => {
  return {
    formHeaderContainer: {
      padding: appTheme.spacing(1),
      display: 'flex',
      flexDirection: 'row',
    },
    formTitleContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    formTitle: {
      fontSize: 20,
      fontWeight: 600,
    },
    formtTitleUnderline: {
      width: '100%',
      height: 2,
      backgroundColor: 'black',
      marginLeft: appTheme.spacing(3 / 2),
    },
    formTitleSpacer: {
      flexGrow: 1,
    },
    cancelFormContainer: {},
    formDivider: {
      height: 2,
      backgroundColor: appTheme.palette.lightGray,
      borderRadius: 2,
    },
    formInputsContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    titleRowContainer: {
      paddingTop: appTheme.spacing(1),
      display: 'flex',
      flexDirection: 'row',
    },
    contentListRatingInputContainer: {
      display: 'flex',
      flexDirection: 'row',
    },
    contentItemContainer: {
      paddingTop: appTheme.spacing(2),
      paddingLeft: appTheme.spacing(1),
    },
    contentItemDivider: {
      height: 2,
      backgroundColor: appTheme.palette.lightGray,
      borderRadius: 2,
    },
    contentItemSubFormContainer: {
      padding: appTheme.spacing(1),
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    contentItemFieldsContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    contentItemActionsContainer: {
      paddingTop: appTheme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
    },
    addContentItemButtonContainer: {
      paddingTop: appTheme.spacing(1),
    },
    formFooterContainer: {
      paddingTop: appTheme.spacing(2),
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
    },
    pageFooterSpacer: {
      height: appTheme.spacing(3),
    },
  }
})

interface CheckboxFieldProps
  extends Required<
    Pick<
      React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >,
      'onChange' | 'checked'
    >
  > {
  fieldLabel: string
}

function CheckboxField(props: CheckboxFieldProps) {
  const { fieldLabel, onChange, checked } = props
  const styles = useCheckboxFieldStyles()
  return (
    <div className={styles.fieldContainer}>
      <div className={styles.fieldLabelContainer}>
        <div className={styles.fieldLabel}>{fieldLabel}</div>
      </div>
      <div className={styles.fieldInputContainer}>
        <input
          onChange={onChange}
          checked={checked}
          className={styles.fieldInput}
          type={'checkbox'}
        />
      </div>
    </div>
  )
}

const useCheckboxFieldStyles = createUseStyles((appTheme: AppTheme) => {
  return {
    fieldContainer: {
      flexShrink: 1,
      padding: appTheme.spacing(1),
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-end',
    },
    fieldLabelContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      paddingRight: appTheme.spacing(1),
      paddingBottom: appTheme.spacing(1 / 4),
    },
    fieldLabel: {
      fontWeight: 400,
    },
    fieldInputContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },
    fieldInput: {
      margin: appTheme.spacing(0),
      width: 21,
      height: 21,
    },
  }
})
