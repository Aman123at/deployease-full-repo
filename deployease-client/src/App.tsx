
import React from 'react'
import './App.css'
import HomePage from './pages/Home'
import DashboardPage from './pages/Dashboard'
import AuthPage from './pages/AuthPage'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Logs from './pages/Logs'

const App:React.FC=()=> {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />}  />
        <Route path='/auth' element={<AuthPage />}  />
        <Route path='/dashboard' element={<DashboardPage />}  />
        <Route path='/logs' element={<Logs />}  />
        <Route path='*' element={<p>Page Not found</p>}  />
      </Routes>
    </BrowserRouter>
  )
}

export default App
