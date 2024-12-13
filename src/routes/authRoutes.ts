import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { User } from '../models/User';
import { authMiddleware } from '../middlewares/authMiddleware';
import { AuthenticatedRequest } from "../middlewares/authMiddleware"
import dotenv from 'dotenv';

dotenv.config();

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

    res.cookie("token", token, {
      httpOnly: true, // Защищает от JS-доступа
      secure: process.env.NODE_ENV === "production", // Включить только для HTTPS
      sameSite: "lax", // Блокирует кросс-сайтовые атаки
      maxAge: 60 * 60 * 1000, // 1 час
    });
    

    console.log('User logged in successfully:', username); // Лог успешного входа
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error); // Логируем ошибку
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/current-user', async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Извлечение токена из кук
    const token = req.cookies.token; // Убедитесь, что cookie-parser настроен

    console.log(req.cookies.token)

    console.log(req.cookies)

    if (!token) {
      console.log('No token in cookies');
      res.status(401).json({ message: 'Unauthorized' });
    }

    // Проверка и декодирование токена
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as { id: string };
    } catch (error) {
      console.log('Invalid token:', error);
      res.status(401).json({ message: 'Unauthorized' });
    }

    console.log('Decoded token:', decodedToken);

    // Поиск пользователя по ID
    const user = await User.findById(decodedToken?.id);
    console.log('Found user:', user);

    if (!user) {
      res.status(401).json({ message: 'User not found' });
    }

    // Возврат данных пользователя
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


export default router;
