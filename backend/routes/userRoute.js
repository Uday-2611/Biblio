import express from 'express';
import { loginUser, registerUser, adminLogin, getCurrentUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/current', getCurrentUser);

export default userRouter;