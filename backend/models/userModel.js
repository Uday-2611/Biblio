import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isSeller: { type: Boolean, default: false },
    cartData: { type: Object, default: {} }  // Add cartData field
});

const userModel = mongoose.model('user', userSchema);

export default userModel;