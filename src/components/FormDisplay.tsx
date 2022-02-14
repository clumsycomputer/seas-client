import { Box, Divider, Stack, Typography } from '@mui/material'
import { ReactNode } from 'react'

export interface FormDisplayProps {
  formTitle: string
  formContent: ReactNode
  formActions: ReactNode
  formError: ReactNode
}

export function FormDisplay(props: FormDisplayProps) {
  const { formTitle, formContent, formActions, formError } = props
  return (
    <Stack padding={2} spacing={2}>
      <Stack spacing={0}>
        <Box display={'flex'} flexDirection={'row'} alignItems={'flex-end'}>
          <Typography variant={'h6'} paddingBottom={4 / 7}>
            {formTitle}
          </Typography>
          <Box flexGrow={1} />
        </Box>
        <Divider
          sx={{
            borderBottomWidth: 2,
          }}
        />
      </Stack>
      <Stack spacing={3}>{formContent}</Stack>
      <Box
        display={'flex'}
        flexDirection={'row-reverse'}
        paddingTop={2}
        paddingBottom={1}
      >
        {formActions}
      </Box>
      {formError}
    </Stack>
  )
}
