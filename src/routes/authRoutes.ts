import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { User } from '../models/User';

const router = express.Router();
router.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES = '1h';

// Регистрация
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    console.log('Missing username or password'); // Логируем отсутствие данных
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }

  try {
    // Проверка на существующего пользователя
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('User already exists:', username); // Логируем дубликат
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Создаем нового пользователя
    const user = new User({ username, password });

    // Сохраняем пользователя в базе данных
    await user.save();

    console.log('User created successfully:', username); // Лог успешного создания
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error); // Логируем ошибку
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// Логин
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found:', username); // Логируем отсутствие пользователя
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    if (!(await user.comparePassword(password))) {
      console.log('Password mismatch for user:', username); // Логируем неверный пароль
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000, // 1 час
    });

    console.log('User logged in successfully:', username); // Лог успешного входа
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error); // Логируем ошибку
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
