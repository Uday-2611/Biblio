import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// ------ Function for add Product ------ 
const addProduct = async (req, res) => {
    try {
        const { name, price, Category, Condition, description, date } = req.body;
        const images = [];
        
        // Process images
        if (req.files) {
            Object.keys(req.files).forEach(key => {
                images.push(req.files[key][0].filename);
            });
        }

        const newProduct = new productModel({
            name,
            price,
            Category,
            Condition,
            description,
            image: images,
            sellerId: req.user._id,
            date: date || new Date()  // Add seller ID from auth middleware
        });

        await newProduct.save();
        res.json({ success: true, message: 'Product added successfully' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const listProducts = async (req, res) => {
    try {
        let products;
        if (req.path === '/my-products') {
            // List only seller's products
            products = await productModel.find({ sellerId: req.user._id });
        } else {
            // List all products
            products = await productModel.find();
        }
        res.json({ success: true, products });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ------ Function for removing Product ------
const removeProduct = async (req, res) => {
    try {

        await productModel.findByIdAndDelete(req.body.id);
        res.json({
            success: true,
            message: 'Product Removed'
        })

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

// ------ Function for single Product info ------
const singleProduct = async (req, res) => {
    try {

        const { productId } = req.body;
        const product = await productModel.findById(productId);

        res.json({
            success: true,
            product
        })

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

export { addProduct, listProducts, removeProduct, singleProduct };