import { Router } from 'express';

const bmwRouter = Router();

bmwRouter.get('/', (req, res) => res.send({title:'GET all models'}));

bmwRouter.get('/:id', (req, res) => res.send({title:'GET model details'}));

bmwRouter.post('/', (req, res) => res.send({title:'CREATE model'}));

bmwRouter.put('/:id', (req, res) => res.send({title:'UPDATE model'}));

bmwRouter.delete('/:id', (req, res) => res.send({title:'DELETE model'}));

export default bmwRouter;

