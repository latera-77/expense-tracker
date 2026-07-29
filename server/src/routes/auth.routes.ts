import { Router } from "express";

const router = Router();

router.post("/register", (req, res) => {
  console.log(req.body);

  res.status(201).json({
    message: "User registered successfully",
  });
});

export default router;