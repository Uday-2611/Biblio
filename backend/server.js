import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import { connectCloudinary } from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import reviewRouter from './routes/reviewRoute.js';
import errorHandler from './middlewares/errorHandler.js';

// ------ App Config ------

const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// ------ Middlewares ------

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// ------ API Endpoints ------

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/review', reviewRouter);

app.get('/' , (req, res) => {
    res.send('API Working');
});

// Error handling middleware
app.use(errorHandler);

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// ------ Starting Server ------
app.listen(port, () => console.log('Server started on PORT: ' + port));

// to start the server -- npm run server