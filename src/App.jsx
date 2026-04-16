import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const ComponentDetail = lazy(() => import('./pages/ComponentDetail.jsx'))

export default function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingScreen progress={0} message="Loading..." />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/component/:id" element={<ComponentDetail />} />
        </Routes>
      </Suspense>
    </>
  )
}
