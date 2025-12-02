import React, { useContext, useState, useRef, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {

  const navigate = useNavigate()
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContent)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true // to send the cookies

      const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp')

      if(data.success) {
        navigate('/email-verify')
        toast.success(data.message)
        setShowDropdown(false)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true // so that we can send the cookies
      const {data} = await axios.post(backendUrl + '/api/auth/logout')
      data.success && setIsLoggedin(false)
      data.success && setUserData(false)
      setShowDropdown(false)
      navigate('/login')
    } catch (error) {
      toast.error('error in logout in Navbar.jsx' + error.message)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className='w-full fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200'>
      <div className='flex justify-between items-center px-4 sm:px-6 lg:px-24 py-3'>
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className='flex items-center gap-2 cursor-pointer hover:opacity-80 transition'
        >
          <img 
            src="/Primetrade-ai.jpg" 
            alt="Primetrade.ai" 
            className='w-8 sm:w-10 h-8 sm:h-10 rounded'
          />
          <span className='text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'>
            Primetrade.ai
          </span>
        </button>

        {/* Navigation Items */}
        {userData ? (
          <div className='flex items-center gap-6'>
            {/* Dashboard Button */}
            <button 
              onClick={() => navigate('/')} 
              className='hidden sm:block text-gray-700 hover:text-indigo-600 font-medium transition duration-200'
            >
              Dashboard
            </button>

            {/* Profile Button */}
            <button 
              onClick={() => navigate('/profile')} 
              className='hidden sm:block text-gray-700 hover:text-indigo-600 font-medium transition duration-200'
            >
              Profile
            </button>

            {/* User Avatar Dropdown */}
            <div className='relative' ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className='w-10 h-10 flex justify-center items-center rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition'
              >
                {userData.name[0].toUpperCase()}
              </button>
              
              {/* Dropdown Menu */}
              {showDropdown && (
                <div className='absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10 animate-in fade-in duration-200'>
                  <ul className='list-none m-0 p-0'>
                    {/* Mobile Navigation */}
                    <li className='block sm:hidden'>
                      <button 
                        onClick={() => {
                          navigate('/')
                          setShowDropdown(false)
                        }}
                        className='w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition text-sm border-b'
                      >
                        Dashboard
                      </button>
                    </li>
                    <li className='block sm:hidden'>
                      <button 
                        onClick={() => {
                          navigate('/profile')
                          setShowDropdown(false)
                        }}
                        className='w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition text-sm border-b'
                      >
                        Profile
                      </button>
                    </li>
                    
                    {/* Verify Email Option */}
                    {!userData.isAccountVerified && (
                      <li>
                        <button
                          onClick={sendVerificationOtp}
                          className='w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition text-sm border-b font-medium text-yellow-600'
                        >
                          ⚠️ Verify Email
                        </button>
                      </li>
                    )}
                    
                    {/* Logout */}
                    <li>
                      <button
                        onClick={logout}
                        className='w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition text-sm font-medium rounded-b-lg flex items-center gap-2'
                      >
                        <span>🚪</span> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            className='flex items-center gap-2 border border-indigo-600 rounded-full px-6 py-2 text-indigo-600 hover:bg-indigo-50 transition-all duration-200 font-medium'
          >
            Login <img src={assets.arrow_icon} alt="" />
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
