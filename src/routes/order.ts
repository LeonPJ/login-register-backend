
import { Router, Request, Response } from 'express'
import verifyToken from '../middleware/verifyToken';

import { createOrder, readAll, readOrder, deleteOrder, updateOrder, readAllName, readAllPhone, readAllAddress, readAllMonth } from '../controller/Order';

export const router = Router();

router.post('/create', verifyToken, createOrder);

router.get('/get', verifyToken, readAll);
router.get('/get/search/name/:name', verifyToken, readAllName);
router.get('/get/search/phone/:phone', verifyToken, readAllPhone);
router.get('/get/search/address/:address', verifyToken, readAllAddress);
router.get('/get/search/month', verifyToken, readAllMonth);
router.get('/get/:id', verifyToken, readOrder);

router.delete('/delete/:id', verifyToken, deleteOrder);

router.patch('/update/:id', verifyToken, updateOrder);
