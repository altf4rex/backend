import mongoose from 'mongoose';
import Movie from './src/models/Movie'; // Подключаем модель фильма
import dotenv from 'dotenv';

dotenv.config(); // Загружаем переменные окружения из .env

// Подключаемся к базе данных
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Добавить новый фильм
const addMovie = async () => {
  const newMovie = new Movie({
    title: 'Dune',
    year: 2021,
    director: 'Denis Villeneuve',
  });
  await newMovie.save(); // Сохраняем фильм
  console.log('Movie added!');
};

// Получить список фильмов
const getMovies = async () => {
  const movies = await Movie.find(); // Получаем все фильмы
  console.log('Movies:', movies);    // Выводим их в консоль
};

// Основная функция
const run = async () => {
  await connectDB(); // Подключение к базе
  await addMovie();  // Добавляем фильм
  await getMovies(); // Получаем фильмы
  mongoose.disconnect(); // Закрываем соединение с базой
};

run();
