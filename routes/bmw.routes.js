import { Router } from 'express';
import {createBmw, deleteBmw, updateBmw} from "../controllers/bmw.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const bmwRouter = Router();

bmwRouter.get('/', (req, res) => res.send({title:'GET all models'}));

bmwRouter.get('/:id', (req, res) => res.send({title:'GET model details'}));

bmwRouter.post('/', authorize, createBmw);

bmwRouter.put('/:id', authorize, updateBmw);

bmwRouter.delete('/:id', authorize, deleteBmw);

export default bmwRouter;

