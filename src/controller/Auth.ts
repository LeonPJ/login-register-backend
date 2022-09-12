import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieSession from 'cookie-session';
import nodemailer from 'nodemailer';

import User from '../models/User';
import { registerValidation, loginValidation, newPasswordValidation, forgotPasswordValidation } from '../middleware/validation';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    // validate the data
    const { error } = registerValidation(req.body);
    if (error)
        return res.status(400).json({ "message": error.details[0].message });

    const { name, email, password } = req.body;

    // check if user is already in the database
    const emailExit = await User.findOne({ email });
    if (emailExit)
        return res.status(400).json({ "message": "email already register" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create a new user
    const user = new User({
        name: name,
        email: email,
        password: hashedPassword
    });

    try {
        const saveUser = await user.save();
        res.status(200).json({ "message": "register", "status": true, "_id": saveUser._id });
    } catch (error) {
        res.status(400).json({ "message": "register", "status": false });
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // validate the data
    const { error } = loginValidation(req.body);
    if (error)
        return res.status(400).json({ "message": error.details[0].message });

    // check if email is already in the database
    const user = await User.findOne({ email });
    if (!user)
        return res.status(400).json({ "message": "email is not found" });

    // password is correct
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
        return res.status(400).json({ "message": "invalid password" });

    try {
        // create a token
        const token = jwt.sign({ name: user.name }, process.env.TOKEN_SECRET!, { expiresIn: '24h' });
        res.status(200).json({ "message": "auth token", "status": true, "token": token });
    } catch (error) {
        res.status(404).json({ "message": "auth token", "status": false });

    }

}

export const newPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, newPassword, confirmNewPassword } = req.body;

    if (newPassword != confirmNewPassword)
        return res.status(400).json({ "message": "new password not same" });

    // validate the data
    const { error } = newPasswordValidation(req.body);
    if (error)
        return res.status(400).json({ "message": error.details[0].message });

    // check if email is already in the database
    const user = await User.findOne({ email });
    if (!user)
        return res.status(400).json({ "message": "email is not found" })

    // password is correct
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
        return res.status(400).json({ "message": "invalid password" });

    // hash new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);
    const result = await User.updateOne({ email }, { "password": newHashedPassword });

    if (!result.acknowledged || !result.modifiedCount)
        return res.status(400).json({ "message": "change password", "status": false });

    res.status(200).json({ "message": "change password", "status": true });
}

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    // validate the data
    const { error } = forgotPasswordValidation(req.body);
    if (error)
        return res.status(400).json({ "message": error.details[0].message });

    // check if email is already in the database
    const user = await User.findOne({ email });
    if (!user)
        return res.status(400).json({ "message": "email is not found" })

    let newPassword = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 10; i++)
        newPassword += characters.charAt(Math.floor(Math.random() * charactersLength));

    // hash new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);
    const result = await User.updateOne({ email }, { "password": newHashedPassword });

    if (!result.acknowledged || !result.modifiedCount)
        return res.status(400).json({ "message": "new password", "status": false });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        secure: false,
        auth: {
            user: process.env.GMAIL_ACCOUNT,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.GMAIL_ACCOUNT, // sender
        // to: email, // receiver
        to: email, // receiver
        subject: '從設密碼', // subject
        text: '新密碼為: ' + newPassword, // plain text body
        // html: "<b>Hello world?</b>", // html body
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ "message": "send mail", "status": true });
    } catch (error) {
        res.status(400).json({ "message": "send mail", "status": false });
    }

}