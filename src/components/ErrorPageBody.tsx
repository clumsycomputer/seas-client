import { Box, Typography } from '@mui/material'

export interface ErrorPageBodyProps {
  errorMessage: string
}

export function ErrorPageBody(props: ErrorPageBodyProps) {
  const { errorMessage } = props
  return (
    <Box
      padding={2}
      flexGrow={1}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Typography variant={'h6'} color={'error.light'} marginTop={-8}>
        {errorMessage}
      </Typography>
    </Box>
  )
}
