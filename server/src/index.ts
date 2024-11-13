import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute';
import adminRoutes from './routes/adminRoutes'
import connectDB from './config/db';
import cors from 'cors';

dotenv.config();
connectDB()

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({  limit: '10mb',extended: false }));

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('server is Running');
});

// Mount user routes
app.use('/api/auth', userRoutes);
app.use('/api/admin',adminRoutes)

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});

export default app;