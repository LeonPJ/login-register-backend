import IOrder from '../interfaces/Order';
import { model, Schema } from 'mongoose';
import { boolean, string } from 'joi';

const OrderSchema: Schema = new Schema({
    name: {
        type: String,
        require: true,
    },
    phone: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        require: true,
    },
    amount: {
        type: Number,
        require: true,
    },
    payment: {
        type: Boolean,
        require: true,
    },
    barrelType: {
        type: Number,
        require: true,
    },
    sendBarrel: {
        type: Number,
        require: true,
    },
    backBarrel: {
        type: Number,
        require: true,
    },
    customerType: {
        type: String,
        require: true,
    },
    createdAt: {
        type: String,
        required: true,
        // type: Date,
        // default: Date.now,
    },
    updatedAt: {
        type: String,
        require: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    }

});

export default model<IOrder>('Order', OrderSchema);