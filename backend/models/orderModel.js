import mongoose from "mongoose";

const orderSchema = new mongoose.Schema ({
    userId: {
        type: String,
        required: true,
    }, 
    items: [{
        _id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: Array,
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    }],
    amount: {
        type: Number,
        required: true,
    }, 
    address: {
        firstName: String,
        lastName: String,
        address: String,
        city: String,
        state: String,
        zip: String,
        phone: String
    }, 
    status: {
        type: String,
        required: true,
        default: 'Order Placed'
    }, 
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cod']
    }, 
    payment: {
        type: Boolean,
        required: true,
        default: false,
    }, 
    date: {
        type: Number,
        required: true,
    }, 
})

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);

export default orderModel;