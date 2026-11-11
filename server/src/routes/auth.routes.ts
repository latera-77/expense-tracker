import { Router } from "express";
import bcrypt from "bcrypt";
import {z} from "zod";
import {prisma} from "../lib/prisma";
import {signToken} from "../lib/jwt";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});


router.post("/register", async (req, res) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success){
    res.status(400).json({message: "Invalid email or password(min 8 characters"});
    return;
  }
  
  const {email,password} = result.data;

  const existing = await prisma.user.findUnique({where:{email}});
  if (existing){
    res.status(409).json({message: "Email already registered"});
    return;
  }

  const passwordHash = await bcrypt.hash(password,10);

  const user = await prisma.user.create({
    data : { email, passwordHash },
  });


  res.status(201).json({ id: user.id, email: user.email});
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/login", async (req, res) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success){
    res.status(400).json({message: "Email and password are required"});
    return;
  }

  const {email,password} = result.data;

  const user = await prisma.user.findUnique({where:{email}});
  const passwordOK = user
  ? await bcrypt.compare(password, user.passwordHash)
  : false;

  if (!user|| !passwordOK){
    res.status(401).json({message: "Invalid email or password"});
    return;
  }

  const token = signToken({userId: user.id});
  res.json({token, user:{id:user.id, email: user.email}});
}); 

export default router;