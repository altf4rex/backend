import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

class Database {
  private static instance: mongoose.Connection | null = null;

  static async getInstance(): Promise<mongoose.Connection> {
    if (!this.instance) {
      try {
        const connection = await mongoose.connect(process.env.MONGO_URI!);
        this.instance = connection.connection;
        console.log("MongoDB connected using Singleton Pattern");
      } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Завершаем процесс при ошибке
      }
    }
    return this.instance;
  }
}

export default Database;
