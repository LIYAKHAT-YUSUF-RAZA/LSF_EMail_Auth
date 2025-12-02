import express from 'express';
import {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskStats
} from '../controllers/taskController.js';
import userAuth from '../middleware/userAuth.js';

const taskRouter = express.Router();

// All routes require authentication
taskRouter.use(userAuth);

taskRouter.get('/', getTasks); // Get all tasks with filters
taskRouter.post('/', createTask); // Create new task
taskRouter.get('/stats', getTaskStats); // Get task statistics
taskRouter.get('/:taskId', getTaskById); // Get single task
taskRouter.put('/:taskId', updateTask); // Update task
taskRouter.delete('/:taskId', deleteTask); // Delete task

export default taskRouter;
