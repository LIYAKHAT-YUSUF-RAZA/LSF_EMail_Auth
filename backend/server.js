import express from "express"  
import cors from "cors"; // connection between frontend and backend
import 'dotenv/config'; // for hiding environment variables
import cookieParser from "cookie-parser"; // to parse cookies

import connectDB from "./config/mongodb.js"; // import the connectDB function to connect to the database
import authRouter from './routes/authRouter.js'
import userRouter from "./routes/userRoutes.js";
import taskRouter from "./routes/taskRoutes.js";

const app = express(); // create an express app
app.use(express.json()) // to parse JSON bodies
const port = process.env.PORT || 4000 // set the port to 4000 or the port from environment variables
connectDB(); // connect to the database

const allowedOrigins = ['http://localhost:5173', 'https://lsf-e-mail-auth.vercel.app', 'https://primetradeai-task.vercel.app']  // can add all the frontend URL where you want to use this backend server and we can add multiple urls by separating them with ,

app.use(express.json()) // to parse JSON bodies or all the requests will be passes using json
app.use(cookieParser()) // to parse cookies from the request headers

// Enhanced CORS configuration for cross-domain cookies
app.use(cors({ 
    origin: allowedOrigins, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Add headers for credentials
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    next();
});

// API Endpoints
app.get('/',(req, res) => res.send("API woking fine"))
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/tasks', taskRouter)

app.listen(port, ()=> { // start the server
    console.log(`server started on PORT:${port}`)    
});