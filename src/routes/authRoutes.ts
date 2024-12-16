import express from 'express';
import { login, register, logout, getCurrentUser } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Регистрация
router.post('/register', register);

// Логин
router.post('/login', login);

// Выход из системы
router.post('/logout', logout);

// Получение текущего пользователя (с проверкой токена)
// router.get('/current-user', authMiddleware, getCurrentUser);

// !
router.get('/current-user', getCurrentUser);

export default router;
