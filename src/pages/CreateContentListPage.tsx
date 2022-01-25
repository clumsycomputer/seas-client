import { useState } from 'react'
import { createUseStyles } from 'react-jss'
import { AppTheme } from '../appTheme'
import { PageContainer } from '../components/PageContainer'
import { ContentList } from '../models/ContentList'

export function CreateContentListPage() {
  const styles = useStyles()
  const [formState, setFormState] = useState<
    Pick<
      ContentList,
      'contentListTitle' | 'contentListRating' | 'contentListItems'
    >
  >({
    contentListTitle: '',
    contentListRating: 'safeForWork',
    contentListItems: [],
  })
  return (
    <PageContainer>
      <div className={styles.formHeaderContainer}>
        <div className={styles.formTitleContainer}>
          <div className={styles.formTitle}>
            Create New List
            <div className={styles.formtTitleUnderline} />
          </div>
        </div>
        <div className={styles.formTitleSpacer} />
      </div>
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
            checked={formState.contentListRating === 'notSafeForWork'}
            onChange={(someChangeEvent) => {
              setFormState({
                ...formState,
                contentListRating:
                  someChangeEvent.target.checked === true
                    ? 'notSafeForWork'
                    : 'safeForWork',
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
                    value={someContentItem.contentTitle}
                    onChange={(someChangeEvent) => {
                      const nextContentListItems = [
                        ...formState.contentListItems,
                      ]
                      nextContentListItems.splice(contentItemIndex, 1, {
                        ...someContentItem,
                        contentTitle: someChangeEvent.target.value,
                      })
                      setFormState({
                        ...formState,
                        contentListItems: nextContentListItems,
                      })
                    }}
                  />
                  <TextField
                    fieldLabel={'Content Author:'}
                    value={someContentItem.contentAuthor}
                    onChange={(someChangeEvent) => {
                      const nextContentListItems = [
                        ...formState.contentListItems,
                      ]
                      nextContentListItems.splice(contentItemIndex, 1, {
                        ...someContentItem,
                        contentAuthor: someChangeEvent.target.value,
                      })
                      setFormState({
                        ...formState,
                        contentListItems: nextContentListItems,
                      })
                    }}
                  />
                  <TextField
                    fieldLabel={'Content Host:'}
                    value={someContentItem.contentLink.contentHostName}
                    onChange={(someChangeEvent) => {
                      const nextContentListItems = [
                        ...formState.contentListItems,
                      ]
                      nextContentListItems.splice(contentItemIndex, 1, {
                        ...someContentItem,
                        contentLink: {
                          ...someContentItem.contentLink,
                          contentHostName: someChangeEvent.target.value,
                        },
                      })
                      setFormState({
                        ...formState,
                        contentListItems: nextContentListItems,
                      })
                    }}
                  />
                  <TextField
                    fieldLabel={'Content Url:'}
                    value={someContentItem.contentLink.contentHref}
                    onChange={(someChangeEvent) => {
                      const nextContentListItems = [
                        ...formState.contentListItems,
                      ]
                      nextContentListItems.splice(contentItemIndex, 1, {
                        ...someContentItem,
                        contentLink: {
                          ...someContentItem.contentLink,
                          contentHref: someChangeEvent.target.value,
                        },
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
                    contentTitle: '',
                    contentAuthor: '',
                    contentLink: {
                      contentHostName: '',
                      contentHref: '',
                    },
                  },
                ],
              })
            }}
          />
        </div>
        <div className={styles.formFooterContainer}>
          <ActionButton
            disabled={false}
            buttonLabel={'✓ Publish'}
            onClick={() => {}}
          />
          <ActionButton
            disabled={false}
            buttonLabel={'✕ Cancel'}
            onClick={() => {}}
          />
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
      paddingLeft: appTheme.spacing(1),
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
      paddingTop: appTheme.spacing(1),
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    pageFooterSpacer: {
      height: appTheme.spacing(3),
    },
  }
})

interface TextFieldProps
  extends Required<
    Pick<
      React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >,
      'onChange' | 'value'
    >
  > {
  fieldLabel: string
}

function TextField(props: TextFieldProps) {
  const { fieldLabel, onChange, value } = props
  const styles = useTextFieldStyles()
  return (
    <div className={styles.fieldContainer}>
      <div className={styles.fieldLabelContainer}>
        <div className={styles.fieldLabel}>{fieldLabel}</div>
      </div>
      <div className={styles.fieldInputContainer}>
        <input
          onChange={onChange}
          value={value}
          className={styles.fieldInput}
          type={'text'}
        />
      </div>
    </div>
  )
}

const useTextFieldStyles = createUseStyles((appTheme: AppTheme) => {
  return {
    fieldContainer: {
      flexShrink: 1,
      padding: appTheme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
    },
    fieldLabelContainer: {
      display: 'flex',
      alignItems: 'flex-end',
      paddingBottom: appTheme.spacing(1 / 4),
    },
    fieldLabel: {
      fontWeight: 400,
    },
    fieldInputContainer: {},
    fieldInput: {},
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

interface ActionButtonProps
  extends Required<
    Pick<
      React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >,
      'onClick' | 'disabled'
    >
  > {
  buttonLabel: string
}

function ActionButton(props: ActionButtonProps) {
  const { disabled, onClick, buttonLabel } = props
  const styles = useActionButtonStyles()
  return (
    <div className={styles.buttonContainer}>
      <button
        className={styles.actionButton}
        type={'button'}
        disabled={disabled}
        onClick={onClick}
      >
        {buttonLabel}
      </button>
    </div>
  )
}

const useActionButtonStyles = createUseStyles((appTheme: AppTheme) => {
  return {
    buttonContainer: {
      padding: appTheme.spacing(1),
      display: 'flex',
      flexDirection: 'row',
    },
    actionButton: {
      flexGrow: 1,
    },
  }
})
