import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express';
import connectDB from './config/mongodb.js';
import { connectCloudinary } from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import reviewRouter from './routes/reviewRoute.js';
import errorHandler from './middlewares/errorHandler.js';
import { corsOptions, securityHeaders } from './middlewares/security.js';

// App Config ->
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middlewares ->
app.set('trust proxy', 1);
app.use(express.json({ limit: '1mb' }));
app.use(securityHeaders);
app.use(cors(corsOptions));

// Backward compatibility: existing frontend sends `token` header.
app.use((req, res, next) => {
    if (!req.headers.authorization && req.headers.token) {
        req.headers.authorization = `Bearer ${req.headers.token}`;
    }
    next();
});

app.use(clerkMiddleware());
app.use('/uploads', express.static('uploads'));

// API Endpoints ->
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/review', reviewRouter);

app.get('/', (req, res) => {
    res.send('API Working');
});

// Handle 404 routes ->
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware ->
app.use(errorHandler);

// Starting Server ->
app.listen(port, () => console.log('Server started on PORT: ' + port));
