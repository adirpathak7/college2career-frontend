import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Dashboard from './components/user/Dashboard'
import Forgot from './components/auth/Forgot'
import ResetPassword from './components/auth/ResetPassword'
import Loader from './components/Loader'

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

function AppContent() {
  const locationPath = useLocation()

  const getCookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
    return null
  }


  const validAuth = () => {
    const userToken = getCookie("userToken")
    return userToken !== null
  }

  const isLoggedIn = validAuth()

  const PublicRoute = ({ element }) => {
    return !isLoggedIn ? element : <Navigate to="/user/dashboard" />
  }

  const PrivateRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to='/login' />
  }

  return (
    <div className="App">
      <Loader />
      {locationPath.pathname !== '/user/dashboard' && !locationPath.pathname.startsWith('/user/dashboard') && <Navbar />}
      <Routes>
        <Route path='/' element={<PublicRoute element={<Home />} />} />
        <Route path='/register' element={<PublicRoute element={<Register />} />} />
        <Route path='/login' element={<PublicRoute element={<Login />} />} />
        <Route path='/forgotPassword' element={<PublicRoute element={<Forgot />} />} />
        <Route path='/reset-password' element={<PublicRoute element={<ResetPassword />} />} />
        <Route path='/user/dashboard' element={<PrivateRoute element={<Dashboard />} />} />
      </Routes>
    </div >
  )
}

export default App
