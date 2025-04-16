import mongoose from "mongoose";

// ------ Schema is a structure using which we can create data in database ------

const productSchema = new mongoose.Schema({
    name: {
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

// If product model already available then it will be used otherwise it will be created. 
const productModel = mongoose.models.product || mongoose.model('product', productSchema);

export default productModel;