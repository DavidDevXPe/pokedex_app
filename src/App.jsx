import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import './styles/pokemonTypes.css'
import PokedexPage from './pages/PokedexPage'
import HomePage from './pages/HomePage'
import PokeIdPage from './pages/PokeIdPage'
import ProtectedRoutes from './pages/ProtectedRoutes'

function App() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route element={<ProtectedRoutes/>}>
          <Route path='/pokedex' element={<PokedexPage/>}/>
          <Route path='/pokedex/:id' element={<PokeIdPage/>}/>
        </Route>
      </Routes>
  )
}

export default App
