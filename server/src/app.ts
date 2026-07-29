import express from 'express';
import cors from 'cors';



const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: "Expense Tracker API is running"});
});

app.post("/api/auth/register", (req, res) => {
    console.log(req.body);

    res.status(201)
    .json({message: "User registered successfully"});
});

export default app;