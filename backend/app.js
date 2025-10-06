import express from "express";
import createDatabase from "./db/createDB.js"
const app = express();

async function initializeDatabase() {
  try {
    await createDatabase();
    console.log("Database and tables initialized successfully.");
  } catch (err) {
    console.error("Error during database initialization:", err);
  }
}
initializeDatabase();

app.get("/", () => {
  "Hello world";
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
