import express from "express";
import { openDb } from "../db/database.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// ADD COMMENT
router.post("/:postId", auth, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  const db = await openDb();

  await db.run(
    "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
    [postId, req.user.id, content]
  );

  res.json({ message: "Comment posted" });
});

export default router;
