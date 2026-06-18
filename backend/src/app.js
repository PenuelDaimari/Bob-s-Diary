import express from 'express';
import morgan from 'morgan';
import authRouter from '../routes/auth.routes.js';
import blogRouter from '../routes/blog.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from '../config/config.js';

const app = express();


app.use(cors({
    origin: config.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth',authRouter)
app.use('/api/blogs', blogRouter);

app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to the Bob's API!" });
});

export default app;