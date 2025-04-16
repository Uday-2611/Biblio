import express from 'express';
import { loginUser, registerUser, adminLogin, getCurrentUser, sendResetCode, verifyAndResetPassword } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/current', getCurrentUser);
userRouter.post('/forgot-password', sendResetCode);
userRouter.post('/reset-password', verifyAndResetPassword);

export default userRouter;