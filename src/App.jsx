import { lazy, Suspense, useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import './styles/pokemonTypes.css'
import './styles/theme.css'
import ProtectedRoutes from './pages/ProtectedRoutes'
import useTranslation from './hooks/useTranslation'
import AppErrorBoundary from './components/AppErrorBoundary'

const HomePage = lazy(() => import('./pages/HomePage'))
const PokedexPage = lazy(() => import('./pages/PokedexPage'))
const PokeIdPage = lazy(() => import('./pages/PokeIdPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export const RouteFocusManager = () => {
  const { pathname } = useLocation()
  const previousPathname = useRef(pathname)

  useEffect(() => {
    const routeChanged = previousPathname.current !== pathname
    previousPathname.current = pathname
    window.scrollTo({ top: 0, behavior: 'auto' })

    if (!routeChanged) return undefined

    let observer
    let animationFrame

    const focusMainContent = () => {
      const mainContent = document.querySelector('main')
      if (!mainContent) return false

      mainContent.setAttribute('tabindex', '-1')
      mainContent.focus({ preventScroll: true })
      return true
    }

    animationFrame = window.requestAnimationFrame(() => {
      if (focusMainContent()) return

      observer = new MutationObserver(() => {
        if (!focusMainContent()) return
        observer.disconnect()
      })
      observer.observe(document.getElementById('root') ?? document.body, {
        childList: true,
        subtree: true,
      })
    })

    return () => {
      window.cancelAnimationFrame(animationFrame)
      observer?.disconnect()
    }
  }, [pathname])

  return null
}

function App() {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  return (
    <>
      <RouteFocusManager />
      <AppErrorBoundary
        actionLabel={t('app.reload')}
        description={t('app.errorDescription')}
        onReset={() => window.location.reload()}
        resetKey={pathname}
        title={t('app.errorTitle')}
      >
        <Suspense fallback={<p className='routeLoading' role='status'>{t('app.loading')}</p>}>
          <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route element={<ProtectedRoutes/>}>
              <Route path='/pokedex' element={<PokedexPage/>}/>
              <Route path='/pokedex/:id' element={<PokeIdPage/>}/>
            </Route>
            <Route path='*' element={<NotFoundPage/>}/>
          </Routes>
        </Suspense>
      </AppErrorBoundary>
    </>
  )
}

export default App
