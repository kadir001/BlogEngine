import express from "express";
import { openDb } from "../db/database.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// LIKE / UNLIKE
router.post("/:postId", auth, async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  const db = await openDb();

  try {
    await db.run(
      "INSERT INTO likes (post_id, user_id) VALUES (?, ?)",
      [postId, userId]
    );

    return res.json({ liked: true });
  } catch {
    await db.run(
      "DELETE FROM likes WHERE post_id = ? AND user_id = ?",
      [postId, userId]
    );

    return res.json({ liked: false });
  }
});

export default router;
