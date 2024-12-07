import { Request, Response } from "express";
import Page from "../models/Page";

export const PageController = {
  // Получение всех страниц
  async getAll(req: Request, res: Response) {
    try {
      // const pages = await Page.find({}, { title: 1, _id: 1 });
      const pages = await Page.find();
      res.json(pages); // Отправляем ответ и ничего не возвращаем
    } catch (error) {
      res.status(500).json({ message: "An error occurred while fetching pages" });
    }
  },

  // Получение страницы по ID
  async getById(req: Request, res: Response) {
    try {
      const page = await Page.findById(req.params.id);
      if (!page) {
        res.status(404).send("Page not found");
        return; // Завершаем выполнение функции
      }
      res.json(page); // Отправляем ответ
    } catch (error) {
      res.status(500).json({ message: "An error occurred while fetching the page" });
    }
  },

  // Создание новой страницы
  async create(req: Request, res: Response) {
    try {
      const { title, content } = req.body;
      const newPage = Page.createPage(title, content); // Используем фабрику
      await newPage.save(); // Сохраняем в БД
      res.status(201).json(newPage); // Ответ клиенту
    } catch (error) {
      res.status(400).json({ message: "Error creating page" });
    }
  },

  // Обновление страницы по ID
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;

      const updatedPage = await Page.findByIdAndUpdate(
        id,
        { title, content, updatedAt: new Date() },
        { new: true }
      );

      if (!updatedPage) {
        res.status(404).send("Page not found");
        return;
      }
      res.json(updatedPage);
    } catch (error) {
      res.status(500).json({ message: "Error updating page" });
    }
  },

  // Удаление страницы по ID
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await Page.findByIdAndDelete(id);
      if (!result) {
        res.status(404).send("Page not found");
        return;
      }
      res.status(204).send(); // Успешное удаление
    } catch (error) {
      res.status(500).json({ message: "Error deleting page" });
    }
  },
};

