import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES = '7d'; // Увеличен срок действия токена для удобства


// Регистрация пользователя
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Логин пользователя
export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    // Устанавливаем куки
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Включаем secure только в продакшене
      sameSite: 'none',
      path: '/', // Указываем явно
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Выход из системы
export const logout = (req: Request, res: Response): void => {
  res.clearCookie('token', {
    path: '/', // Совпадает с установкой
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Включаем secure только в продакшене
    sameSite: 'none', // Совпадает с установкой
  });
  res.status(200).send({ message: 'Logged out' });
};

// Получение данных текущего пользователя
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id; // Декодированный ID из токена
    const user = await User.findById(userId).select('-password'); // Исключаем пароль из результата

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error });
  }
};
