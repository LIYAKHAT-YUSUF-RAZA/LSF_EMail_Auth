import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

    const navigate = useNavigate()

    const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent)

    const [state, setState] = useState('Sign Up')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)

    // Check password strength
    const checkPasswordStrength = (pwd) => {
        let strength = 0
        
        // Minimum 8 characters
        if (pwd.length >= 8) strength++
        
        // Contains lowercase letters
        if (/[a-z]/.test(pwd)) strength++
        
        // Contains uppercase letters
        if (/[A-Z]/.test(pwd)) strength++
        
        // Contains numbers
        if (/[0-9]/.test(pwd)) strength++
        
        // Contains special symbols
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) strength++
        
        return strength
    }

    const handlePasswordChange = (e) => {
        const pwd = e.target.value
        setPassword(pwd)
        setPasswordStrength(checkPasswordStrength(pwd))
    }

    const isPasswordStrong = () => {
        return passwordStrength === 5
    }

    const getPasswordStrengthColor = () => {
        if (passwordStrength === 0) return 'bg-gray-300'
        if (passwordStrength === 1 || passwordStrength === 2) return 'bg-red-500'
        if (passwordStrength === 3) return 'bg-yellow-500'
        if (passwordStrength === 4) return 'bg-blue-500'
        return 'bg-green-500'
    }

    const getPasswordStrengthText = () => {
        if (!password) return ''
        if (passwordStrength === 0 || passwordStrength === 1) return 'Very Weak'
        if (passwordStrength === 2) return 'Weak'
        if (passwordStrength === 3) return 'Fair'
        if (passwordStrength === 4) return 'Good'
        return 'Strong'
    }

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();

            // Validate password strength for Sign Up
            if (state === 'Sign Up' && !isPasswordStrong()) {
                toast.error('Password must be strong: 8+ characters with uppercase, lowercase, numbers, and special symbols')
                return
            }

            axios.defaults.withCredentials = true

            if (state === 'Sign Up') {
                const { data } = await axios.post(backendUrl + '/api/auth/register',
                    { name, email, password })

                if (data.success) {
                    setIsLoggedin(true)
                    getUserData()
                    navigate('/')
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/auth/login',
                    { email, password })

                if (data.success) {
                    setIsLoggedin(true)
                    getUserData()
                    navigate('/')
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error('error in onSubmitHandler in Login.jsx' + error.message)
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>

            <img onClick={() => navigate('/')} src="/Primetrade-ai.jpg" alt="Primetrade.ai"
                className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />

            <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
 {/*  
                <div className='text-center mb-6'>
                    <h1 className='text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2'>
                        Primetrade.ai Task
                    </h1>
                  <p className='text-gray-300 text-sm'>Smart Task Management Platform</p> 
                </div>*/}

                <h2 className='text-3xl font-semibold text-white text-center mb-3'>
                    {state === 'Sign Up' ? 'Create account' : 'Login'}</h2>

                <p className='text-center text-sm mb-6'>
                    {state === 'Sign Up' ? 'Create your account' : 'Login to your account'}</p>

                <form onSubmit={onSubmitHandler}>
                    {state === 'Sign Up' && (

                        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>

                            <img src={assets.person_icon} alt="" />

                            <input onChange={e => setName(e.target.value)} value={name} type="text" placeholder='Full Name' required
                                className='bg-transparent outline-none' />

                        </div>
                    )}

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>

                        <img src={assets.mail_icon} alt="" />

                        <input onChange={e => setEmail(e.target.value)} value={email}
                            type="email" placeholder='Email Id' required
                            className='bg-transparent outline-none' />

                    </div>

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>

                        <img src={assets.lock_icon} alt="" />

                        <input 
                            onChange={handlePasswordChange}
                            value={password}
                            type={showPassword ? "text" : "password"}
                            placeholder='Password' 
                            required
                            className='bg-transparent outline-none flex-1' 
                        />

                        <button
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            className='text-indigo-300 hover:text-indigo-100 transition cursor-pointer p-1'
                            title={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                // Eye Open - Outline style
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                                </svg>
                            ) : (
                                // Eye Closed - Filled style
                                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/>
                                </svg>
                            )}
                        </button>

                    </div>

                    {/* Password Strength Indicator - Only show on Sign Up */}
                    {state === 'Sign Up' && password && (
                        <div className='mb-4'>
                            <div className='flex items-center justify-between mb-2'>
                                <span className='text-xs text-gray-400'>Password Strength</span>
                                <span className={`text-xs font-semibold ${
                                    passwordStrength === 5 ? 'text-green-400' :
                                    passwordStrength === 4 ? 'text-blue-400' :
                                    passwordStrength === 3 ? 'text-yellow-400' :
                                    'text-red-400'
                                }`}>
                                    {getPasswordStrengthText()}
                                </span>
                            </div>
                            <div className='w-full h-2 bg-gray-600 rounded-full overflow-hidden'>
                                <div 
                                    className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                ></div>
                            </div>
                            
                            {/* Requirements Checklist */}
                            <div className='mt-3 space-y-1 text-xs'>
                                <div className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-400' : 'text-gray-500'}`}>
                                    <span>{password.length >= 8 ? '✓' : '✗'}</span>
                                    <span>Minimum 8 characters</span>
                                </div>
                                <div className={`flex items-center gap-2 ${/[a-z]/.test(password) ? 'text-green-400' : 'text-gray-500'}`}>
                                    <span>{/[a-z]/.test(password) ? '✓' : '✗'}</span>
                                    <span>Lowercase letter (a-z)</span>
                                </div>
                                <div className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-green-400' : 'text-gray-500'}`}>
                                    <span>{/[A-Z]/.test(password) ? '✓' : '✗'}</span>
                                    <span>Uppercase letter (A-Z)</span>
                                </div>
                                <div className={`flex items-center gap-2 ${/[0-9]/.test(password) ? 'text-green-400' : 'text-gray-500'}`}>
                                    <span>{/[0-9]/.test(password) ? '✓' : '✗'}</span>
                                    <span>Number (0-9)</span>
                                </div>
                                <div className={`flex items-center gap-2 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-green-400' : 'text-gray-500'}`}>
                                    <span>{/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? '✓' : '✗'}</span>
                                    <span>Special symbol (!@#$%^&*...)</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password ?</p>

                    <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer'>{state}</button>

                </form>

                {state === 'Sign Up' ? (
                    <p className='text-gray-400 text-center text-xs mt-4'>Already have an Account? &nbsp;&nbsp;
                        <span onClick={() => setState('Login')} className='text-blue-400 cursor-pointer underline'>Login Here</span>
                    </p>
                ) : (
                    <p className='text-gray-400 text-center text-xs mt-4'>Don't have an Account? &nbsp;&nbsp;
                        <span onClick={() => setState('Sign Up')} className='text-blue-400 cursor-pointer underline'>Sign Up</span>
                    </p>
                )}

            </div>
        </div>
    )
}

export default Login
