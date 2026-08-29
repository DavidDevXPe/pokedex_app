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

const MAIN_CONTENT_ID = 'main-content'

const focusContent = (element, { scroll = false } = {}) => {
  if (!element) return false

  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '-1')
  }

  if (scroll) {
    element.scrollIntoView?.({ behavior: 'auto', block: 'start' })
  }

  element.focus({ preventScroll: true })
  return true
}

export const SkipLink = () => {
  const { t } = useTranslation()

  const handleClick = event => {
    event.preventDefault()
    focusContent(document.getElementById(MAIN_CONTENT_ID), { scroll: true })
  }

  return (
    <a className='skipLink' href={`#${MAIN_CONTENT_ID}`} onClick={handleClick}>
      {t('app.skipToContent')}
    </a>
  )
}

export const RouteFocusManager = () => {
  const { hash, pathname } = useLocation()
  const previousLocation = useRef({ hash, pathname })

  useEffect(() => {
    const routeChanged = previousLocation.current.pathname !== pathname
    const hashChanged = previousLocation.current.hash !== hash
    previousLocation.current = { hash, pathname }

    let observer
    let animationFrame

    const getHashTargetId = () => {
      if (!hash) return ''

      try {
        return decodeURIComponent(hash.slice(1))
      } catch {
        return hash.slice(1)
      }
    }

    const targetId = getHashTargetId()
    const shouldFocus = Boolean(targetId) || routeChanged || hashChanged

    if (!targetId) {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }

    if (!shouldFocus) return undefined

    const focusNavigationTarget = () => {
      const target = targetId
        ? document.getElementById(targetId)
        : document.getElementById(MAIN_CONTENT_ID)

      return focusContent(target, { scroll: Boolean(targetId) })
    }

    animationFrame = window.requestAnimationFrame(() => {
      if (focusNavigationTarget()) return

      observer = new MutationObserver(() => {
        if (!focusNavigationTarget()) return
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
  }, [hash, pathname])

  return null
}

function App() {
  const { t } = useTranslation()
  const { hash, pathname, search } = useLocation()

  return (
    <>
      <SkipLink />
      <RouteFocusManager />
      <AppErrorBoundary
        actionLabel={t('app.reload')}
        description={t('app.errorDescription')}
        onReset={() => window.location.reload()}
        resetKey={`${pathname}${search}${hash}`}
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
