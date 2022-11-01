
import { Router, Request, Response, NextFunction } from 'express'
import moment from 'moment';
import { format } from 'path';
import Order from '../models/Order';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { name, phone, address, barrelType, sendBarrel, backBarrel, customerType, amount, payment, createdAt, updatedAt } = req.body;

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

    try {
        const saveOrder = await order.save();
        res.status(200).json({ "message": "create", "status": true, "_id": saveOrder._id });
    } catch (error) {
        res.status(400).json({ "message": "create", "status": false });
    }
};

export const readAll = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const readAll = await Order.find({ "$and": [{ isDeleted: false }, { deletedAt: null }] }).sort({ _id: -1 });
        res.status(200).send(readAll);
    } catch (error) {
        res.status(400).send(error);
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

export const readCurrentMonth = async (req: Request, res: Response, next: NextFunction) => {

    const startDay = moment().startOf('month').format('YYYY-MM-DD 00:00:00');
    const endDay = moment().endOf('month').format('YYYY-MM-DD 23:59:99');

    try {
        const readCurrentMonth = await Order.find({ "$and": [{ createdAt: { $gte: startDay, $lte: endDay } }, { isDeleted: false }, { deletedAt: null }] }).sort({ _id: -1 });
        res.status(200).send(readCurrentMonth);
    } catch (error) {
        res.status(400).send(error);
    }

};

export const readCurrentPeriod = async (req: Request, res: Response, next: NextFunction) => {

    const { year, month } = req.params;

    let startDay = '';
    let endDay = '';
    if (month == '00') {// all year
        startDay = year + '-' + '01' + '-' + '01' + ' 00:00:00';
        endDay = year + '-' + '12' + '-' + '31' + ' 23:59:99';
    } else if (month == '02' || month == '04' || month == '06' || month == '09' || month == '11') {
        startDay = year + '-' + month + '-' + '01' + ' 00:00:00';
        endDay = year + '-' + month + '-' + '30' + ' 23:59:99';
    } else {
        startDay = year + '-' + month + '-' + '01' + ' 00:00:00';
        endDay = year + '-' + month + '-' + '31' + ' 23:59:99';
    }

    try {
        const readCurrentPeriod = await Order.find({ "$and": [{ createdAt: { $gte: startDay, $lte: endDay } }, { isDeleted: false }, { deletedAt: null }] }).sort({ _id: -1 });
        res.status(200).send(readCurrentPeriod);
    } catch (error) {
        res.status(400).send(error);
    }

};

export const readOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const readOrder = await Order.findOne({ _id: id });
        res.status(200).send(readOrder);
    } catch (error) {
        res.status(400).send(error);
    }

};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const timestamp = moment().utc().utcOffset(+8).format().replace('T', ' ').slice(0, 19);
        await Order.updateOne({ _id: id }, { updatedAt: timestamp, isDeleted: true, deletedAt: timestamp });
        res.status(200).json({ "message": "delete", "status": true, "_id": id });
    } catch (error) {
        // res.status(404).send(error);
        res.status(400).json({ "message": "delete", "status": false, "_id": id });
    }

};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const timestamp = moment().utc().utcOffset(+8).format().replace('T', ' ').slice(0, 19);
        const updatedAt = { "updatedAt": timestamp };
        const updateDate = await Object.assign(req.body, updatedAt);
        await Order.updateOne({ _id: id }, updateDate);
        res.status(200).json({ "message": "update", "status": true, "_id": id, "updatedAt": timestamp });
    } catch (error) {
        // res.status(401).send(error);
        res.status(400).json({ "message": "update", "status": false, "_id": id });
    }

};
