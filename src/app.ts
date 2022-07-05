import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

// import router
import { router as authRoute } from './routes/auth';
import { router as orderRoute } from './routes/order';


const options: cors.CorsOptions = {
    origin: '*'
};

// connect db
// mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('connect to db'));
mongoose.connect(process.env.DB_CONNECT, () => console.log('connect to db'));


// middleware
app.use(cors(options));
app.use(express.json());

// route middleware
app.use('/api/user/', authRoute);
app.use('/api/order/', orderRoute);

app.listen(process.env.PORT || 8080, () => console.log('server running'));