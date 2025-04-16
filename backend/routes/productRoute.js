import express from 'express';
import { addProduct, listProducts, removeProduct, singleProduct } from '../controllers/productController.js';
import upload from '../middlewares/multer.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const productRouter = express.Router();

productRouter.post('/add', authMiddleware, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), addProduct);

productRouter.post('/remove', authMiddleware, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);
productRouter.get('/my-products', authMiddleware, listProducts);

export default productRouter;