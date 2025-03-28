import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import SignUp from './components/SignUp'
import SignIn from './components/SignIn'

function App() {

  return (
      <div className="App">
        <Router>
          <Navbar />
          <Routes>
            <Route path='/' />
            <Route path='/signUp' element={<SignUp />} />
            <Route path='/signIn' element={<SignIn />} />
          </Routes>
        </Router>
      </div>
  )
}

export default App
