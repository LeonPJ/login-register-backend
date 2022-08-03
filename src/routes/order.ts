
import { Router, Request, Response } from 'express'
import verifyToken from '../middleware/verifyToken';

import { createOrder, readAll, readOrder, deleteOrder, updateOrder } from '../controller/Order';

export const router = Router();

router.post('/create', verifyToken, createOrder);

router.get('/get', verifyToken, readAll);

router.get('/get/:id', verifyToken, readOrder);

router.delete('/delete/:id', verifyToken, deleteOrder);

router.patch('/update/:id', verifyToken, updateOrder);
