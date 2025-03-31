import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Dashboard from './components/user/Dashboard'
import Forgot from './components/auth/Forgot'
1
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

function AppContent() {
  const locationPath = useLocation()

  const validAuth = () => {
    const userToken = sessionStorage.getItem("userToken")
    return userToken !== null
  }

  const isLoggedIn = validAuth()

  return (
    <div className="App">
      {locationPath.pathname !== '/user/dashboard' && !locationPath.pathname.startsWith('/user/dashboard') && <Navbar />}
      <Routes>
        <Route path='/' />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgotPassword' element={<Forgot />} />
        <Route
          path='/user/dashboard'
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </div >
  )
}

export default App
