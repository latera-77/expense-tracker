import { Router} from "express";   
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";


const router = Router();
router.use(requireAuth);

const expenseSchema = z.object({
    amount: z.coerce.number().positive(),
    category: z.string().min(1).max(50),
    note: z.string().trim().max(200).optional(),
    date: z.coerce.date().optional(),
});

router.post("/", async (req, res) => {
    const result = expenseSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({ message: "Invalid expense data" });
        return;
    }

    const expense = await prisma.expense.create({
        data: {
            ...result.data,
            userId: req.user.id as number,
        },
    });

    res.json(expense);
});


router.get("/", async (req, res) => {
    const expenses = await prisma.expense.findMany({
        where: { userId: req.user.id as number },
        orderBy: { date: "desc" },
    });

    res.json(expenses);
});

export default router;