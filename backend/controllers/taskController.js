import taskModel from '../models/taskModel.js';

// Get all tasks for authenticated user
export const getTasks = async (req, res) => {
    try {
        const userId = req.userId;
        const { status, priority, search } = req.query;

        let query = { userId };

        if (status) {
            query.status = status;
        }

        if (priority) {
            query.priority = priority;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const tasks = await taskModel.find(query).sort({ createdAt: -1 });

        res.json({ success: true, tasks });
    } catch (error) {
        res.json({ success: false, message: 'Error fetching tasks: ' + error.message });
    }
};

// Create new task
export const createTask = async (req, res) => {
    try {
        const userId = req.userId;
        const { title, description, priority, dueDate } = req.body;

        if (!title) {
            return res.json({ success: false, message: 'Title is required' });
        }

        const task = new taskModel({
            userId,
            title,
            description: description || '',
            priority: priority || 'medium',
            dueDate: dueDate ? new Date(dueDate) : null,
        });

        await task.save();

        res.json({ success: true, message: 'Task created successfully', task });
    } catch (error) {
        res.json({ success: false, message: 'Error creating task: ' + error.message });
    }
};

// Get single task by ID
export const getTaskById = async (req, res) => {
    try {
        const userId = req.userId;
        const { taskId } = req.params;

        const task = await taskModel.findOne({ _id: taskId, userId });

        if (!task) {
            return res.json({ success: false, message: 'Task not found' });
        }

        res.json({ success: true, task });
    } catch (error) {
        res.json({ success: false, message: 'Error fetching task: ' + error.message });
    }
};

// Update task
export const updateTask = async (req, res) => {
    try {
        const userId = req.userId;
        const { taskId } = req.params;
        const { title, description, status, priority, dueDate } = req.body;

        const task = await taskModel.findOne({ _id: taskId, userId });

        if (!task) {
            return res.json({ success: false, message: 'Task not found' });
        }

        if (title) task.title = title;
        if (description !== undefined) task.description = description;
        if (status) task.status = status;
        if (priority) task.priority = priority;
        if (dueDate) task.dueDate = new Date(dueDate);

        task.updatedAt = new Date();
        await task.save();

        res.json({ success: true, message: 'Task updated successfully', task });
    } catch (error) {
        res.json({ success: false, message: 'Error updating task: ' + error.message });
    }
};

// Delete task
export const deleteTask = async (req, res) => {
    try {
        const userId = req.userId;
        const { taskId } = req.params;

        const task = await taskModel.findOneAndDelete({ _id: taskId, userId });

        if (!task) {
            return res.json({ success: false, message: 'Task not found' });
        }

        res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        res.json({ success: false, message: 'Error deleting task: ' + error.message });
    }
};

// Get task statistics
export const getTaskStats = async (req, res) => {
    try {
        const userId = req.userId;

        const total = await taskModel.countDocuments({ userId });
        const pending = await taskModel.countDocuments({ userId, status: 'pending' });
        const inProgress = await taskModel.countDocuments({ userId, status: 'in-progress' });
        const completed = await taskModel.countDocuments({ userId, status: 'completed' });

        res.json({
            success: true,
            stats: { total, pending, inProgress, completed }
        });
    } catch (error) {
        res.json({ success: false, message: 'Error fetching stats: ' + error.message });
    }
};
