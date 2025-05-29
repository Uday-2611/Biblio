import { cloudinary } from "../config/cloudinary.js";
import productModel from "../models/productModel.js";

// Add product ->
const addProduct = async (req, res) => {
    try {
        const { name, author, price, Category, Condition, description, date } = req.body;
        const images = [];
        
        // Upload images to Cloudinary
        if (req.files) {
            for (const key of Object.keys(req.files)) {
                const file = req.files[key][0];
                try {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: 'bookstore',
                        resource_type: 'auto'
                    });
                    images.push(result.secure_url);
                } catch (uploadError) {
                    console.error(`Error uploading image ${key}:`, uploadError);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to upload one or more images'
                    });
                }
            }
        }

        if (images.length === 0) {
            return res.status(400).json({ success: false, message: 'At least one image is required' });
        }

        const newProduct = new productModel({
            name,
            author,
            price: Number(price),
            Category,
            Condition,
            description,
            image: images,
            sellerId: req.user._id,
            date: date || new Date()
        });

        await newProduct.save();
        res.status(201).json({ success: true, message: 'Product added successfully' });

    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to add product. Please try again.'
        });
    }
};

const listProducts = async (req, res) => {
    try {
        let products;
        if (req.path === '/my-products') {
            products = await productModel.find({ sellerId: req.user._id });
        } else {
            products = await productModel.find();
        }
        res.json({ success: true, products });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { addProduct, listProducts };