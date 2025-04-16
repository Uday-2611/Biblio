import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

// ------ App Config ------

const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// ------ Middlewares ------

app.use(express.json());
app.use(cors({
    origin: [
      'https://page-turner-henna.vercel.app',  // Vercel frontend
      'http://localhost:5173',                // Frontend local development
      'http://localhost:4000'                 // Backend local development
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
  }));
app.use('/uploads', express.static('uploads')); // Add this line to serve uploaded files

// ------ API Endpoints ------

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.get('/' , (req, res) => {
    res.send('API Working');
})

// ------ Starting Server ------
app.listen(port, () => console.log('Server strated on PORT: ' + port))

// to start the server -- npm run server