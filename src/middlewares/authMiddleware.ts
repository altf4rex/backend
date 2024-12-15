import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET!;

// Интерфейс для пользовательских данных
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload; // Расширенный запрос с декодированным токеном
}

// Middleware для проверки токена
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded; // Сохраняем данные пользователя в запросе
    next(); // Передаем управление следующему обработчику
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};
