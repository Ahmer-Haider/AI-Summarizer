import './config/env.js';
import express from 'express';
import cors from 'cors';
import summaryRoutes from './api/summaryRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', summaryRoutes);

export default app;