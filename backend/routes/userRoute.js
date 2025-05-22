import express from 'express';
import { loginUser, registerUser,  getCurrentUser, sendResetCode, verifyAndResetPassword } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/current', getCurrentUser);
userRouter.post('/forgot-password', sendResetCode);
userRouter.post('/reset-password', verifyAndResetPassword);

export default userRouter;