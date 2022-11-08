import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

// import router
import { router as authRoute } from './routes/auth';
import { router as orderRoute } from './routes/order';


const options: cors.CorsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    credentials: true,
};

// connect db
// mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('connect to db'));
mongoose.connect(process.env.DB_CONNECT, () => console.log('connect to db'));

// middleware
app.use(cors(options));
app.use(express.json());

// route middleware
app.use('/user/', authRoute);
app.use('/order/', orderRoute);

app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));