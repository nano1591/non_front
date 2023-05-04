import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.css'
import './assets/tw.css'
import 'material-icons/iconfont/material-icons.css'
import { App } from './App'
import { HashRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
