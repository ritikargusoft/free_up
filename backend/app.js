import express from "express";
import cors from "cors";
import createDatabase from "./db/createDB.js";
import createTables from "./db/pgDbInit.js";
import cookieParser from "cookie-parser";
import router from "./routes.js";
import { v2 as cloudinary } from "cloudinary";
import { initCloudinary } from "./utils/cloudinaryConfig.js";

const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

initCloudinary();

async function initializeDatabase() {
  try {
    await createDatabase();
    await createTables();
    console.log("Database and tables initialized successfully.");
  } catch (err) {
    console.error("Error during database initialization:", err);
  }
}
initializeDatabase();

app.use(express.json());
app.use(cookieParser());

app.use("/", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
