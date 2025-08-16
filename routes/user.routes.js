import { Router } from 'express'
import { getUsers, getUser } from '../controllers/user.controller.js';
import authorize from '../middlewares/auth.middleware.js';
import requireAdmin from "../middlewares/roleGuard.middleware.js";
const userRouter = Router();

//GET /users -> get all users, and get user by id(dynamic based on id)
userRouter.get('/',getUsers);

userRouter.get('/:id', authorize,requireAdmin, getUser);

userRouter.post('/',(req, res) => res.send({title:'CREATE new user'}));

userRouter.put('/:id',(req, res) => res.send({title:'UPDATE user'}));

userRouter.delete('/:id',(req, res) => res.send({title:'DELETE user'}));

export default userRouter;