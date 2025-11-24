import express from "express";
import cors from "cors";

import { initDb } from "./db/database.js";

// Routes
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API ROUTES
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/likes", likeRoutes);

// Init DB
initDb();

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
