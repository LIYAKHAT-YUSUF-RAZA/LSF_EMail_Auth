import React, { useContext, useState } from 'react'
import { AppContent } from '../context/AppContext.jsx'
import TaskForm from './TaskForm.jsx'

const TaskList = ({ tasks }) => {
    const { deleteTask, updateTask } = useContext(AppContent)
    const [editingTask, setEditingTask] = useState(null)
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const handleStatusChange = async (taskId, newStatus) => {
        await updateTask(taskId, { status: newStatus })
    }

    const handleDelete = async (taskId) => {
        await deleteTask(taskId)
        setDeleteConfirm(null)
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800'
            case 'medium':
                return 'bg-yellow-100 text-yellow-800'
            case 'low':
                return 'bg-green-100 text-green-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-gray-100 text-gray-800'
            case 'in-progress':
                return 'bg-blue-100 text-blue-800'
            case 'completed':
                return 'bg-green-100 text-green-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (editingTask) {
        return <TaskForm taskToEdit={editingTask} onClose={() => setEditingTask(null)} />
    }

    if (tasks.length === 0) {
        return (
            <div className='bg-white rounded-lg shadow p-12 text-center'>
                <p className='text-gray-500 text-lg'>No tasks found. Create one to get started!</p>
            </div>
        )
    }

    return (
        <div className='bg-white rounded-lg shadow overflow-hidden'>
            <div className='overflow-x-auto'>
                <table className='w-full'>
                    <thead className='bg-gray-50 border-b'>
                        <tr>
                            <th className='px-6 py-3 text-left text-sm font-semibold text-gray-900'>Title</th>
                            <th className='px-6 py-3 text-left text-sm font-semibold text-gray-900'>Status</th>
                            <th className='px-6 py-3 text-left text-sm font-semibold text-gray-900'>Priority</th>
                            <th className='px-6 py-3 text-left text-sm font-semibold text-gray-900'>Due Date</th>
                            <th className='px-6 py-3 text-left text-sm font-semibold text-gray-900'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y'>
                        {tasks.map((task) => (
                            <tr key={task._id} className='hover:bg-gray-50'>
                                <td className='px-6 py-4'>
                                    <div>
                                        <p className='font-medium text-gray-900'>{task.title}</p>
                                        <p className='text-sm text-gray-600'>{task.description.substring(0, 50)}{task.description.length > 50 ? '...' : ''}</p>
                                    </div>
                                </td>
                                <td className='px-6 py-4'>
                                    <select
                                        value={task.status}
                                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)} border-0 focus:outline-none cursor-pointer`}
                                    >
                                        <option value='pending'>Pending</option>
                                        <option value='in-progress'>In Progress</option>
                                        <option value='completed'>Completed</option>
                                    </select>
                                </td>
                                <td className='px-6 py-4'>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                    </span>
                                </td>
                                <td className='px-6 py-4'>
                                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                                </td>
                                <td className='px-6 py-4'>
                                    <div className='flex gap-2'>
                                        <button
                                            onClick={() => setEditingTask(task)}
                                            className='text-indigo-600 hover:text-indigo-900 font-medium text-sm'
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(task._id)}
                                            className='text-red-600 hover:text-red-900 font-medium text-sm'
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-lg p-6 max-w-sm'>
                        <h3 className='text-lg font-bold text-gray-900 mb-4'>Delete Task</h3>
                        <p className='text-gray-600 mb-6'>Are you sure you want to delete this task? This action cannot be undone.</p>
                        <div className='flex gap-4'>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className='flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition'
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition'
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TaskList
