export interface AppTheme extends Jss.Theme {
  spacing: (spacingScalar: number) => number
  palette: {
    lightGray: string
    red: string
  }
}

export const appTheme: AppTheme = {
  spacing: (spacingScalar) => spacingScalar * 8,
  palette: {
    lightGray: '#EEEEEE',
    red: '#D32F2F',
  },
}
