import { createTheme } from '@mui/material'

export const appTheme = createTheme({})

declare module '@mui/material/styles' {
  interface Theme {}
  interface ThemeOptions {}
}
