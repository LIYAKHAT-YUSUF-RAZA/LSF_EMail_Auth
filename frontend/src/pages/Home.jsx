import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Dashboard from '../components/Dashboard.jsx'
import { AppContent } from '../context/AppContext.jsx'

const Home = () => {
  const { isLoggedin, isAuthChecking } = useContext(AppContent)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthChecking && !isLoggedin) {
      navigate('/login')
    }
  }, [isLoggedin, isAuthChecking, navigate])

  // Show loading while checking authentication
  if (isAuthChecking) {
    return (
      <div className='w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4'></div>
          <p className='text-gray-600 font-medium'>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedin) {
    return null
  }

  return (
    <div className='w-full'>
      <Navbar />
      <div className='pt-20'>
        <Dashboard />
      </div>
    </div>
  )
}

export default Home
