import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import SignUp from './components/auth/SignUp'
import SignIn from './components/auth/SignIn'
import Dashboard from './components/user/Dashboard'

function App() {

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/signIn' element={<SignIn />} />
          <Route path='/user/dashboard' element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
