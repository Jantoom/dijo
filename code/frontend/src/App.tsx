
import {
  Route,
  Routes,
  BrowserRouter,
  useNavigate,
  useLocation
} from 'react-router-dom'
import TestPage from './pages/TestPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MainPage from './pages/MainPage'
import MarketplacePage from './pages/MarketplacePage'
import useAuth, {AuthProvider} from './context/userAuth'
import { useEffect } from 'react'
import AssetPage from './pages/AssetPage'

function Router() {
  const { getAccessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!getAccessToken() && location.pathname !== "/register" && location.pathname !== "/login") {
      navigate('/login');
    }
  }, []);

  const authorisedRoutes = (
    <>
        <Route path="/main" element={<MainPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/assets" element={<AssetPage />}/>
    </>
  );

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      { getAccessToken() && authorisedRoutes }
    </Routes>
  );
}

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
            <Router />
        </AuthProvider>
     </BrowserRouter>
    </>
  )
}

export default App
