import { openDb } from "../db/database.js";
import bcrypt from "bcrypt";

export async function createUser(username, password, role = "user") {
  const db = await openDb();
  const hashedPassword = await bcrypt.hash(password, 10);
  return db.run(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [username, hashedPassword, role]
  );
}

export async function getUserByUsername(username) {
  const db = await openDb();
  return db.get("SELECT * FROM users WHERE username = ?", [username]);
}
