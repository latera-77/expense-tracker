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
            userId: req.userId as number,
        },
    });

    res.json(expense);
});


router.get("/", async (req, res) => {
    const {month,category} = req.query;

    let dateFilter ={};
    if (typeof month === "string"){
        if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      res.status(400).json({ message: "month must look like 2026-11" });
      return;
    }
    const [year, mon] = month.split("-").map(Number);
    dateFilter = {
        date: {
            gte: new Date(Date.UTC(year, mon - 1, 1)),
            lt: new Date(Date.UTC(year, mon, 1)),
        },
    };
}
    const expenses = await prisma.expense.findMany({
        where: {
            userId: req.userId as number,
            ...dateFilter,
            ...(typeof category === "string" ? { category } : {}),
        },
        orderBy: { date: "desc" },
    });
    res.json(expenses);
});

function parseId(value:unknown): number | null {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}


router.get("/summary", async (req, res) => {
  const totals = await prisma.expense.groupBy({
    by: ["category"],
    where: { userId: req.userId as number },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
  });

  res.json(
    totals.map((t) => ({
      category: t.category,
      total: t._sum.amount,
    }))
  );
});


router.get("/:id", async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({ message: "Invalid id" });
        return;
    }

    const expense = await prisma.expense.findFirst({
        where: { id, userId: req.userId as number },
    }); 

    if (!expense) {
        res.status(404).json({ message: "Expense not found" });
        return;
    }

    res.json(expense);
});

router.put("/:id", async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({ message: "Invalid id" });
        return;
    }

    const result = expenseSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ message: "Invalid expense data" });
        return;
    }

    const updated = await prisma.expense.update({
        where: { id },
        data: result.data,
    });

    res.json(updated);
});

router.delete("/:id", async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({ message: "Invalid id" });
        return;
    }

    const existing = await prisma.expense.findFirst({
        where: { id, userId: req.userId as number },
    });
    if (!existing) {
        res.status(404).json({ message: "Expense not found" });
        return;
    }

    await prisma.expense.delete({ where: { id } });
    res.status(204).send();
});


export default router;