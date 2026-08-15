import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import './styles/pokemonTypes.css'
import './styles/theme.css'
import ProtectedRoutes from './pages/ProtectedRoutes'
import useTranslation from './hooks/useTranslation'

const HomePage = lazy(() => import('./pages/HomePage'))
const PokedexPage = lazy(() => import('./pages/PokedexPage'))
const PokeIdPage = lazy(() => import('./pages/PokeIdPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function App() {
  const { pathname } = useLocation()
  const { t } = useTranslation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
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
  )
}

export default App
