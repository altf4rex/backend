import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;

// Интерфейс для расширенного запроса с пользовательскими данными
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload; // Декодированные данные пользователя из токена
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;  // Завершаем выполнение, если токен отсутствует
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; // Указание типа для токена
    req.user = decoded; // Добавляем декодированные данные пользователя в объект запроса
    next(); // Переходим к следующему обработчику маршрута
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' }); // Отправляем ошибку, если токен некорректен
  }
};


