import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Database from "./database/db"; 
import pageRoutes from "./routes/pageRoutes";
import errorHandler from "./middlewares/errorHandler";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: "http://127.0.0.1:3000" })); // Разрешить запросы только с фронтенда
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API is running. Use /api/pages to access endpoints.");
});

app.use("/api", pageRoutes);
app.use(errorHandler);

(async () => {
  try {
    await Database.getInstance();
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})(); 

