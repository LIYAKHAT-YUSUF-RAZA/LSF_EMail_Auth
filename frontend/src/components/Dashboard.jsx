import React, { useContext, useState, useEffect } from 'react'
import { AppContent } from '../context/AppContext.jsx'
import { toast } from 'react-toastify'
import TaskForm from './TaskForm.jsx'
import TaskList from './TaskList.jsx'

const Dashboard = () => {
    const { tasks, taskStats, getTasks } = useContext(AppContent)
    const [showForm, setShowForm] = useState(false)
    const [filterStatus, setFilterStatus] = useState('')
    const [filterPriority, setFilterPriority] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const filters = {}
        if (filterStatus) filters.status = filterStatus
        if (filterPriority) filters.priority = filterPriority
        if (searchQuery) filters.search = searchQuery
        getTasks(filters)
    }, [filterStatus, filterPriority, searchQuery])

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6'>
            <div className='max-w-7xl mx-auto pt-2'>
                
                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-4xl font-bold text-gray-800 mb-2'>Task Dashboard</h1>
                    <p className='text-gray-600'>Manage your tasks efficiently</p>
                </div>

                {/* Statistics */}
                <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
                    <div className='bg-white rounded-lg shadow p-6'>
                        <div className='text-3xl font-bold text-indigo-600'>{taskStats.total}</div>
                        <div className='text-gray-600 text-sm'>Total Tasks</div>
                    </div>
                    <div className='bg-white rounded-lg shadow p-6'>
                        <div className='text-3xl font-bold text-yellow-600'>{taskStats.pending}</div>
                        <div className='text-gray-600 text-sm'>Pending</div>
                    </div>
                    <div className='bg-white rounded-lg shadow p-6'>
                        <div className='text-3xl font-bold text-blue-600'>{taskStats.inProgress}</div>
                        <div className='text-gray-600 text-sm'>In Progress</div>
                    </div>
                    <div className='bg-white rounded-lg shadow p-6'>
                        <div className='text-3xl font-bold text-green-600'>{taskStats.completed}</div>
                        <div className='text-gray-600 text-sm'>Completed</div>
                    </div>
                </div>

                {/* Add Task Button */}
                <div className='mb-6'>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition'
                    >
                        {showForm ? 'Cancel' : '+ Add New Task'}
                    </button>
                </div>

                {/* Task Form */}
                {showForm && (
                    <div className='mb-8'>
                        <TaskForm onClose={() => setShowForm(false)} />
                    </div>
                )}

                {/* Filters */}
                <div className='bg-white rounded-lg shadow p-6 mb-8'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Search</label>
                            <input
                                type='text'
                                placeholder='Search by title or description...'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            >
                                <option value=''>All Status</option>
                                <option value='pending'>Pending</option>
                                <option value='in-progress'>In Progress</option>
                                <option value='completed'>Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Priority</label>
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            >
                                <option value=''>All Priorities</option>
                                <option value='low'>Low</option>
                                <option value='medium'>Medium</option>
                                <option value='high'>High</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Task List */}
                <TaskList tasks={tasks} />

            </div>
        </div>
    )
}

export default Dashboard
