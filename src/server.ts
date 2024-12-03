import express from "express";
import dotenv from "dotenv";
import Database from "./database/db"; 
import pageRoutes from "./routes/pageRoutes";
import errorHandler from "./middlewares/errorHandler";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
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

