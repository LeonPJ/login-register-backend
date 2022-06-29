import { Document } from "mongoose";

export default interface IUser extends Document {
    name: String
    email: string;
    password: string;
    data: Date;
}