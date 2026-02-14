import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        sparse: true
    },
    isSeller: {
        type: Boolean,
        default: true
    },
    cartData: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
