import express from 'express';
import { getCurrentUser } from '../controllers/userController.js';
import authUser from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.get('/current', authUser, getCurrentUser);

export default userRouter;
