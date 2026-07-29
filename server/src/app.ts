import express from 'express';
import cors from 'cors';


app.use(cors());
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: "Expense Tracker API is running"});
});

export default app;