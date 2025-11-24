import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { openDb } from "../db.js";

const router = express.Router();
const JWT_SECRET = "replace_with_secure_secret";

// Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required" });

  try {
    const db = await openDb();
    const hash = await bcrypt.hash(password, 10);
    await db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hash]);
    res.json({ message: "User registered" });
  } catch (err) {
    res.status(400).json({ message: "Username already exists" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const db = await openDb();
  const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, userId: user.id, role: user.role });
});

export default router;
