
import { Router, Request, Response, NextFunction } from 'express'
import moment from 'moment';
import { format } from 'path';
import Order from '../models/Order';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { name, phone, address, barrelType, sendBarrel, backBarrel, customerType, amount, payment, createdAt, updatedAt } = req.body;

    // const date = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }).replace('/', '-').replace('/', '-').replace('上午', '').replace('下午', '');

    // console.log(new Date());

    const order = new Order({
        name: name,
        phone: phone,
        address: address,
        amount: amount,
        payment: payment,
        barrelType: barrelType,
        sendBarrel: sendBarrel,
        backBarrel: backBarrel,
        customerType: customerType,
        createdAt: createdAt,
        updatedAt: updatedAt,
    });

    const saveOrder = await order.save();

    if (!saveOrder._id) {
        res.status(201).json({ "message": "create", "status": false });
        return;
    }

    res.status(201).json({ "message": "create", "status": true, "_id": saveOrder._id });

};

export const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const readAll = await Order.find({ "$and": [{ isDeleted: false }, { deletedAt: null }] }).sort({ _id: -1 });
        res.status(200).send(readAll);
    } catch (error) {
        res.status(404).send(error);
    }

};

export const readAllName = async (req: Request, res: Response, next: NextFunction) => {

    const { name } = req.params;

    try {
        const readAllName = await Order.find({ "$and": [{ name: name }, { isDeleted: false }, { deletedAt: null }] }).sort({ _id: -1 });
        res.status(200).send(readAllName);
    } catch (error) {
        res.status(404).send(error);
    }

};

export const readAllPhone = async (req: Request, res: Response, next: NextFunction) => {

    const { phone } = req.params;

    try {
        const readAllPhone = await Order.find({ "$and": [{ phone: phone }, { isDeleted: false }, { deletedAt: null }] }).sort({ _id: -1 });
        res.status(200).send(readAllPhone);
    } catch (error) {
        res.status(404).send(error);
    }

};

export const readAllAddress = async (req: Request, res: Response, next: NextFunction) => {

    const { address } = req.params;

    try {
        const readAllAddress = await Order.find({ "$and": [{ address: address }, { isDeleted: false }, { deletedAt: null }] }).sort({ _id: -1 });
        res.status(200).send(readAllAddress);
    } catch (error) {
        res.status(404).send(error);
    }

};

export const readAllMonth = async (req: Request, res: Response, next: NextFunction) => {

    // const { month } = req.params;

    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD 00:00:00');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD 23:59:99');

    try {
        const readAllMonth = await Order.find({
            "$and": [{
                createdAt: {
                    $gte: startOfMonth,
                    $lte: endOfMonth
                }
            },
            { isDeleted: false }, { deletedAt: null }]
        }).sort({ _id: -1 });
        res.status(200).send(readAllMonth);
    } catch (error) {
        res.status(404).send(error);
    }

};

export const readOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const order = await Order.findOne({ _id: id });
    if (!order)
        return res.status(401).json({ "message": "readOrder", "status": false, "_id": id });
    else {
        try {
            const readOrder = await Order.findOne({ _id: id });
            res.status(200).send(readOrder);
        } catch (error) {
            res.status(404).send(error);
        }
    }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const order = await Order.findOne({ _id: id });

    if (!order)
        return res.status(401).json({ "message": "delete", "status": false, "_id": id });
    else {
        try {
            let timestamp = moment().format().replace('T', ' ').replace('+08:00', '');

            await Order.updateOne({ _id: id }, { updatedAt: timestamp, isDeleted: true, deletedAt: timestamp });
            res.status(201).json({ "message": "delete", "status": true, "_id": id });
        } catch (error) {
            res.status(404).send(error);
        }
    }

};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;
    const { name, phone, address, barrelType, sendBarrel, backBarrel, customerType, amount, payment } = req.body;

    const order = await Order.findOne({ _id: id });
    if (!order)
        return res.status(401).json({ "message": "update", "status": false, "_id": id });
    else {

        try {
            let timestamp = moment().format().replace('T', ' ').replace('+08:00', '');

            let updatedAt = { "updatedAt": timestamp };
            let updateDate = await Object.assign(req.body, updatedAt);
            await Order.updateOne({ _id: id }, updateDate);

            // await Order.updateOne({ _id: _id }, updateDate);
            res.status(201).json({ "message": "update", "status": true, "_id": id });

        } catch (error) {
            res.status(401).send(error);
        }

    }

};
