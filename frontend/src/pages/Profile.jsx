import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar.jsx'

const Profile = () => {
    const navigate = useNavigate()
    const { userData, backendUrl, isLoggedin } = useContext(AppContent)
    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(userData?.name || '')
    const [email, setEmail] = useState(userData?.email || '')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    if (!isLoggedin) {
        navigate('/login')
        return null
    }

    const handleProfileUpdate = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Note: Implement your own profile update endpoint
            // For now, we'll just show a success message
            toast.success('Profile would be updated (implement endpoint in backend)')
            setIsEditing(false)
        } catch (error) {
            toast.error('Error updating profile: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        try {
            // Note: Implement your own password change endpoint
            // This would typically require the current password for verification
            toast.success('Password would be changed (implement endpoint in backend)')
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (error) {
            toast.error('Error changing password: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
            <Navbar />
            
            <div className='max-w-4xl mx-auto px-6 py-10'>
                
                {/* Profile Header */}
                <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
                    <div className='flex items-center justify-between mb-6'>
                        <h1 className='text-3xl font-bold text-gray-800'>My Profile</h1>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition'
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {!isEditing ? (
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-600'>Full Name</label>
                                <p className='text-lg text-gray-900'>{userData?.name}</p>
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-600'>Email Address</label>
                                <p className='text-lg text-gray-900'>{userData?.email}</p>
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-600'>Account Status</label>
                                <div className='flex items-center gap-2'>
                                    {userData?.isAccountVerified ? (
                                        <>
                                            <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                                            <span className='text-lg text-green-600'>Verified</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                                            <span className='text-lg text-yellow-600'>Not Verified</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleProfileUpdate} className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name</label>
                                <input
                                    type='text'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                                <input
                                    type='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                />
                            </div>
                            <div className='flex gap-4'>
                                <button
                                    type='submit'
                                    disabled={loading}
                                    className='flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50'
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type='button'
                                    onClick={() => setIsEditing(false)}
                                    className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition'
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Change Password Section */}
                <div className='bg-white rounded-lg shadow-lg p-8'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-6'>Change Password</h2>
                    
                    <form onSubmit={handlePasswordChange} className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Current Password</label>
                            <input
                                type='password'
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder='Enter your current password'
                                required
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>New Password</label>
                            <input
                                type='password'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder='Enter new password'
                                required
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Confirm New Password</label>
                            <input
                                type='password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder='Confirm new password'
                                required
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            />
                        </div>

                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50'
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default Profile
