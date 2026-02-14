import { cloudinary } from "../config/cloudinary.js";
import productModel from "../models/productModel.js";

const CATEGORY_ALLOWLIST = new Set(['Fiction', 'Non-Fiction', 'Academic']);
const CONDITION_ALLOWLIST = new Set(['New', 'Like-New', 'Good', 'Fair']);

const sanitizeText = (value, maxLen) => {
    if (typeof value !== 'string') return '';
    return value.trim().slice(0, maxLen);
};

const parseProductDate = (date) => {
    if (!date) return Date.now();
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return Date.now();
    return parsed.getTime();
};

// Add product ->
const addProduct = async (req, res) => {
    try {
        const { name, author, price, Category, Condition, description, date, stock } = req.body;
        const cleanName = sanitizeText(name, 120);
        const cleanAuthor = sanitizeText(author, 120);
        const cleanDescription = sanitizeText(description, 4000);
        const cleanCategory = sanitizeText(Category, 40);
        const cleanCondition = sanitizeText(Condition, 40);
        const parsedPrice = Number(price);
        const parsedStock = stock === undefined ? 1 : Number(stock);
        const productDate = parseProductDate(date);

        if (!cleanName || !cleanAuthor || !cleanDescription) {
            return res.status(400).json({
                success: false,
                message: 'Name, author and description are required'
            });
        }

        if (!Number.isFinite(parsedPrice) || parsedPrice <= 0 || parsedPrice > 100000) {
            return res.status(400).json({
                success: false,
                message: 'Invalid price'
            });
        }

        if (!Number.isInteger(parsedStock) || parsedStock < 0 || parsedStock > 1000) {
            return res.status(400).json({
                success: false,
                message: 'Invalid stock value'
            });
        }

        if (!CATEGORY_ALLOWLIST.has(cleanCategory)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category'
            });
        }

        if (!CONDITION_ALLOWLIST.has(cleanCondition)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid condition'
            });
        }

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
            name: cleanName,
            author: cleanAuthor,
            price: parsedPrice,
            stock: parsedStock,
            Category: cleanCategory,
            Condition: cleanCondition,
            description: cleanDescription,
            image: images,
            sellerId: req.user._id,
            date: productDate
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
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error('Error listing products:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve products' });
    }
};

export { addProduct, listProducts };
