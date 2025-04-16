// cors is used so that front end ip can use backend
// dotenv is used to hide the port number
// express is used for apis
// jspnwebtoken is used for user authentication 
// mongoose is used to connect mongodb
// multer is used to store images on cloudinary storage
// nodemon will restart the server whenever we make changes
// razorpay for online payment 
// validator for validation
// bcrypt for encryption of password

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
app.use(cors());
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