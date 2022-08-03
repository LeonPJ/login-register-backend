
import { Router, Request, Response, NextFunction } from 'express'
import Order from '../models/Order';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { name, phone, address, barrelType, sendBarrel, backBarrel, customerType, amount, payment } = req.body;

    const data = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }).replace('/', '-').replace('/', '-').replace('上午', '').replace('下午', '');

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
        updatedAt: data,
        createdAt: data,
    });

    try {
        const saveOrder = await order.save();
        res.status(201).json({ "message": "create", "status": true, "id": data });
    } catch (error) {
        res.status(400).send(error);
    }
};

export const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const readAll = await Order.find();
        res.status(200).send(readAll);
    } catch (error) {
        res.status(404).send(error);
    }

};

export const readOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const order = await Order.findOne({ _id: id });
    if (!order)
        return res.status(401).json({ "message": "readOrder", "status": false, "id": id });
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
        return res.status(401).json({ "message": "delete", "status": false, "id": id });
    else {
        try {
            const data = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }).replace('/', '-').replace('/', '-').replace('上午', '').replace('下午', '');
            await Order.updateOne({ _id: id }, { updatedAt: data, isDeleted: true, deletedAt: data });
            res.status(201).json({ "message": "delete", "status": true, "id": id });
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
        return res.status(401).json({ "message": "update", "status": false, "id": id });
    else {

        try {
            const data = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }).replace('/', '-').replace('/', '-').replace('上午', '').replace('下午', '');

            await Order.updateOne({ _id: id }, req.body);

            // await Order.updateOne({ createdAt: orderId }, { updatedAt: data });
            res.status(201).json({ "message": "update", "status": true, "id": id });

        } catch (error) {
            res.status(401).send(error);
        }

    }

};
