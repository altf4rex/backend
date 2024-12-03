import { Request, Response, NextFunction } from "express";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Логируем ошибку
  res.status(500).json({ message: err.message || "Internal Server Error" }); // Отправляем 500
};

export default errorHandler;
