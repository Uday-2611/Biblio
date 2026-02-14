import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }, 
    author: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 1,
        min: 0
    },
    image: {
        type: Array,
        required: true,
    },
    Category: {
        type: String,
        required: true,
    },
    Condition: {
        type: String,
        required: true,
    },
    date: {
        type: Number,
        required: true,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
})

const productModel = mongoose.models.product || mongoose.model('product', productSchema);

export default productModel;
