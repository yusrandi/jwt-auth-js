import express from 'express';
import { RefreshToken } from '../controllers/RefreshToken.js';
import { getUser, getUsers, login, logout, register } from '../controllers/UserController.js';
import { verifyToken } from '../middleware/VerifyToken.js';

const UserRouter = express.Router();

UserRouter.get('/users', verifyToken, getUsers);
UserRouter.get('/users/:email', getUser);
UserRouter.post('/users', register);
UserRouter.post('/login', login);
UserRouter.get('/token', RefreshToken);
UserRouter.delete('/logout', logout);

export default UserRouter;
