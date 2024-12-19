import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"; // Добавлено
import Database from "./database/db";
import pageRoutes from "./routes/pageRoutes";
import authRoutes from "./routes/authRoutes";
import errorHandler from "./middlewares/errorHandler";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000; // Преобразование строки в число
const HOST = process.env.PORT ? '0.0.0.0' : "127.0.0.1"

// CORS настройки
app.use(cors({
  origin: 'https://note-app-nuxt-js.vercel.app', // Разрешаем запросы только с фронтенда
  credentials: true, // Разрешаем куки
}));

app.use(express.json());
app.use(cookieParser()); // Подключение cookie-parser

app.get("/", (req, res) => {
  res.send("(￣▽￣)");
});

app.use("/api", pageRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

(async () => {
  try {
    await Database.getInstance(); // Подключение к базе данных
    app.listen(port, HOST, () => {
      console.log(`Server running at http://${HOST}:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();
