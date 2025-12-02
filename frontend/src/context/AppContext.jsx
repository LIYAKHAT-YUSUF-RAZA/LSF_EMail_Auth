import axios from "axios";
import { createContext, useEffect, useState } from "react";
import React from "react";
import { toast } from "react-toastify";
export const AppContent = createContext()

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true // to send the cookies
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [taskStats, setTaskStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
    const [isAuthChecking, setIsAuthChecking] = useState(true); // Track if auth is being verified

    const getAuthState = async () => {
        try {
            setIsAuthChecking(true);
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth')
            if(data.success) {
                setIsLoggedin(true) // if user is already authenticated the set true
                await getUserData() // getting user details
                await getTasks() // getting tasks
                await getTaskStats() // getting task statistics
            } else {
                setIsLoggedin(false);
                setUserData(false);
            }
        } catch (error) {
            // Silent fail - user is not authenticated, this is expected
            setIsLoggedin(false);
            setUserData(false);
        } finally {
            setIsAuthChecking(false);
        }
    }

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error('Error in getUserData in AppContext.jsx' + error.message)
        }
    }

    // Get all tasks with optional filters
    const getTasks = async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.priority) params.append('priority', filters.priority);
            if (filters.search) params.append('search', filters.search);

            const { data } = await axios.get(backendUrl + '/api/tasks' + (params.toString() ? '?' + params.toString() : ''))
            if (data.success) {
                setTasks(data.tasks)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Error fetching tasks: ' + error.message)
        }
    }

    // Create new task
    const createTask = async (taskData) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/tasks', taskData)
            if (data.success) {
                toast.success(data.message)
                getTasks() // refresh tasks
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            toast.error('Error creating task: ' + error.message)
            return false
        }
    }

    // Update task
    const updateTask = async (taskId, taskData) => {
        try {
            const { data } = await axios.put(backendUrl + '/api/tasks/' + taskId, taskData)
            if (data.success) {
                toast.success(data.message)
                getTasks() // refresh tasks
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            toast.error('Error updating task: ' + error.message)
            return false
        }
    }

    // Delete task
    const deleteTask = async (taskId) => {
        try {
            const { data } = await axios.delete(backendUrl + '/api/tasks/' + taskId)
            if (data.success) {
                toast.success(data.message)
                getTasks() // refresh tasks
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            toast.error('Error deleting task: ' + error.message)
            return false
        }
    }

    // Get task statistics
    const getTaskStats = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/tasks/stats')
            if (data.success) {
                setTaskStats(data.stats)
            }
        } catch (error) {
            console.log('Error fetching task stats: ' + error.message)
        }
    }

    useEffect(() => {
        getAuthState();
    },[])

    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData,
        isAuthChecking,
        tasks, getTasks,
        createTask, updateTask, deleteTask,
        taskStats, getTaskStats
    }

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}

