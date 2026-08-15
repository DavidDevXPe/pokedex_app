import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/index.js'
import { PreferencesProvider } from './contexts/PreferencesContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PreferencesProvider>
      <Provider store={store}>
        <HashRouter>
          <App />
        </HashRouter>
      </Provider>
    </PreferencesProvider>
  </React.StrictMode>,
)
