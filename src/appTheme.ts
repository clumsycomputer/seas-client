import { createTheme } from '@mui/material'

// export interface SeasTheme extends Jss.Theme {
//   spacing: (spacingScalar: number) => number
//   palette: {
//     lightGray: string
//     red: string
//   }
// }

export const appTheme = createTheme({})

declare module '@mui/material/styles' {
  interface Theme {}
  interface ThemeOptions {}
}
