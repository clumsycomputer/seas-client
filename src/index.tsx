import { CssBaseline, ThemeProvider } from '@mui/material'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { appTheme } from './appTheme'
import reportWebVitals from './reportWebVitals'
import { SeasApp } from './SeasApp'
import * as Yup from 'yup'

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={appTheme}>
      <BrowserRouter>
        <SeasApp />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
