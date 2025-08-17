import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import summaryRoutes from './routes/summaryRoutes.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use('/api', summaryRoutes);

export default app;
