import axios from "axios";
import { createContext, useEffect, useState } from "react";
import React from "react";
import { toast } from "react-toastify";
export const AppContent = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
    
    // Configure axios to ALWAYS send credentials
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    
    // Create axios instance with proper config
    const axiosInstance = axios.create({
        baseURL: backendUrl,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    // Add request interceptor to include token in Authorization header
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [taskStats, setTaskStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
    const [isAuthChecking, setIsAuthChecking] = useState(true); // Track if auth is being verified

    const getAuthState = async () => {
        try {
            setIsAuthChecking(true);
            
            // Check if we have a token in localStorage
            const storedToken = localStorage.getItem('authToken');
            console.log('Checking auth state. Token:', storedToken ? 'exists' : 'not found');
            
            if (storedToken) {
                // Token exists, set auth headers and fetch user data
                setAuthToken(storedToken);
                axiosInstance.defaults.headers.Authorization = `Bearer ${storedToken}`;
                setIsLoggedin(true);
                console.log('Token found, fetching user data...');
                await getUserData();
                await getTasks();
                await getTaskStats();
            } else {
                // Try to verify with backend (in case cookie is set)
                try {
                    console.log('No token in localStorage, checking with backend...');
                    const {data} = await axiosInstance.get('/api/auth/is-auth');
                    if(data.success) {
                        setIsLoggedin(true);
                        await getUserData();
                        await getTasks();
                        await getTaskStats();
                    } else {
                        setIsLoggedin(false);
                        setUserData(false);
                        localStorage.removeItem('authToken');
                    }
                } catch (err) {
                    console.log('Backend verification failed:', err.message);
                    setIsLoggedin(false);
                    setUserData(false);
                    localStorage.removeItem('authToken');
                }
            }
        } catch (error) {
            console.error('Error in getAuthState:', error.message);
            setIsLoggedin(false);
            setUserData(false);
            localStorage.removeItem('authToken');
        } finally {
            setIsAuthChecking(false);
        }
    }

    const getUserData = async () => {
        try {
            console.log('Fetching user data from:', `${backendUrl}/api/user/data`);
            const { data } = await axiosInstance.get('/api/user/data')
            if (data.success) {
                console.log('User data fetched successfully:', data.userData);
                setUserData(data.userData);
            } else {
                console.error('getUserData error:', data.message);
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error in getUserData:', error.message, error.response?.data);
            toast.error('Error in getUserData in AppContext.jsx: ' + error.message)
        }
    }

    // Get all tasks with optional filters
    const getTasks = async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.priority) params.append('priority', filters.priority);
            if (filters.search) params.append('search', filters.search);

            const { data } = await axiosInstance.get('/api/tasks' + (params.toString() ? '?' + params.toString() : ''))
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
            const { data } = await axiosInstance.post('/api/tasks', taskData)
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
            const { data } = await axiosInstance.put('/api/tasks/' + taskId, taskData)
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
            const { data } = await axiosInstance.delete('/api/tasks/' + taskId)
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
            const { data } = await axiosInstance.get('/api/tasks/stats')
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

