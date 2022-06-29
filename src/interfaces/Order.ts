import { Document } from "mongoose";

export default interface IUser extends Document {
    data: string;
    name: String;
    phone: string;
    address: string;
    barrelType: string;
    sendBarrel: number;
    backBarrel: number;
    customerType: string;

    // createAt: Data;
}