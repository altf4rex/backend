import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

// Расширенный интерфейс для авторизованных запросов
export interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// Middleware для проверки токена
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.authToken;

  if (!token) {
    console.log('No token found in cookies'); // Лог отсутствия токена
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verified successfully:', decoded); // Лог успешной проверки токена
    req.user = decoded as { id: string };
    next();
  } catch (error) {
    console.error('Invalid token:', error); // Лог некорректного токена
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Логин пользователя
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found:', username); // Лог отсутствия пользователя
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!(await user.comparePassword(password))) {
      console.log('Password mismatch for user:', username); // Лог неверного пароля
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    console.log('User logged in successfully:', username); // Лог успешного входа
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error); // Лог ошибок
    res.status(500).json({ message: 'Internal server error', error });
  }
};
