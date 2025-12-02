import React, { useContext, useState } from 'react'
import { AppContent } from '../context/AppContext.jsx'

const TaskForm = ({ onClose, taskToEdit = null }) => {
    const { createTask, updateTask } = useContext(AppContent)
    const [title, setTitle] = useState(taskToEdit?.title || '')
    const [description, setDescription] = useState(taskToEdit?.description || '')
    const [priority, setPriority] = useState(taskToEdit?.priority || 'medium')
    const [dueDate, setDueDate] = useState(taskToEdit?.dueDate ? taskToEdit.dueDate.split('T')[0] : '')
    const [loading, setLoading] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const taskData = {
            title,
            description,
            priority,
            dueDate: dueDate || null
        }

        const success = taskToEdit 
            ? await updateTask(taskToEdit._id, taskData)
            : await createTask(taskData)

        if (success) {
            onClose()
        }
        setLoading(false)
    }

    return (
        <div className='bg-white rounded-lg shadow-lg p-6'>
            <h3 className='text-xl font-bold text-gray-800 mb-4'>
                {taskToEdit ? 'Edit Task' : 'Create New Task'}
            </h3>
            
            <form onSubmit={onSubmit}>
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Title *</label>
                    <input
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Enter task title'
                        required
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                </div>

                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Enter task description'
                        rows='3'
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Priority</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        >
                            <option value='low'>Low</option>
                            <option value='medium'>Medium</option>
                            <option value='high'>High</option>
                        </select>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Due Date</label>
                        <input
                            type='date'
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        />
                    </div>
                </div>

                <div className='flex gap-4'>
                    <button
                        type='submit'
                        disabled={loading}
                        className='flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50'
                    >
                        {loading ? 'Saving...' : (taskToEdit ? 'Update Task' : 'Create Task')}
                    </button>
                    <button
                        type='button'
                        onClick={onClose}
                        className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition'
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default TaskForm
