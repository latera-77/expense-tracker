import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';


const app = express();

app.use(cors());
app.use('/api/auth', authRoutes);
app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: "Expense Tracker API is running"});
});


export default app;