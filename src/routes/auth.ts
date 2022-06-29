import { Router, Request, Response } from 'express';

import { register, login } from '../controller/Auth';

export const router = Router();


router.post('/register', register);
router.post('/login', login);
