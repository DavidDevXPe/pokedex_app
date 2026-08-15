import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import PokeHeader from '../components/protectedRoutes/PokeHeader'

const ProtectedRoutes = () => {
    const trainerName = useSelector(store => store.trainerName)

    if(trainerName.trim().length > 2){
        return <div>
        <PokeHeader />
        <Outlet/>
        </div>
    } else {
        return <Navigate to='/' replace />
    }
}

export default ProtectedRoutes
