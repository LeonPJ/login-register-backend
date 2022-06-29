import IUser from '../interfaces/User';
import { model, Schema } from 'mongoose';

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        require: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        require: true,
        min: 6,
        max: 1024
    },
    data: {
        type: Date,
        default: Date.now
    }

});

export default model<IUser>('User', UserSchema);