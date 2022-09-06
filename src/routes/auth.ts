import { Router, Request, Response } from 'express';

import { register, login, newPassword, forgotPassword } from '../controller/Auth';

export const router = Router();

router.post('/register', register);
router.post('/login', login);

router.patch('/newpassword', newPassword);
router.patch('/forgotpassword', forgotPassword);