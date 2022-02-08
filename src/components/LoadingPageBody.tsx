import { Box, LinearProgress } from '@mui/material'

export function LoadingPageBody() {
  return (
    <Box
      padding={2}
      flexGrow={1}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <LinearProgress
        sx={{
          marginTop: -8,
          width: '100%',
        }}
      />
    </Box>
  )
}
