import { Router } from "express";
import User from '../dao/models/user.model.js';
import bcrypt from "bcrypt";
import { loginUser } from "../controllers/user.controller.js";
import initializePassport from '../config/passport/passport.config.js'
import passport from "passport";
import passportCall from '../middleware/auth.js'

const router = Router();

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const hashed = bcrypt.hashSync(password, 10);
  const newUser = await User.create({
    first_name,
    last_name,
    email,
    password: hashed,
  });
  res.json({ message: "User created", id: newUser._id });
});

router.post("/login", loginUser);


router.get('/current', passportCall, (req, res) => {
  res.json({
    message: 'Usuario autenticado',
    user: req.user
  });
});

export default router;
