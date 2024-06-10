import express from 'express';
import { connect } from 'mongoose';
import router from './routes/index.js';
import cors from 'cors';

const app = express()
const PORT = 8000
app.use(express.json());
connect('mongodb://localhost:27017/Data');


app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use("/api", router) 

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
