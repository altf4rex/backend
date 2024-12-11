import { Response } from "express";
import { AuthenticatedRequest } from "./authController";
import Page from "../models/Page";

export const PageController = {
  // Получить все страницы
  async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const pages = await Page.find();
      res.status(200).json(pages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching pages", error });
    }
  },

  // Получить страницу по ID
  async getById(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    try {
      const page = await Page.findById(id);
      if (!page) {
        res.status(404).json({ message: "Page not found" });
        return;
      }
      res.status(200).json(page);
    } catch (error) {
      res.status(500).json({ message: "Error fetching page", error });
    }
  },

  // Создать новую страницу
  async create(req: AuthenticatedRequest, res: Response) {
    const { title, content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const newPage = new Page({
        title,
        content,
        createdBy: userId,
      });

      const savedPage = await newPage.save();
      res.status(201).json(savedPage);
    } catch (error) {
      res.status(500).json({ message: "Error creating page", error });
    }
  },

  // Обновить страницу по ID
  async update(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const page = await Page.findById(id);
      if (!page) {
        res.status(404).json({ message: "Page not found" });
        return;
      }

      if (page.ownerId.toString() !== userId) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      page.title = title || page.title;
      page.content = content || page.content;

      const updatedPage = await page.save();
      res.status(200).json(updatedPage);
    } catch (error) {
      res.status(500).json({ message: "Error updating page", error });
    }
  },

  // Удалить страницу по ID
  async delete(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const page = await Page.findById(id);
      if (!page) {
        res.status(404).json({ message: "Page not found" });
        return;
      }

      if (page.ownerId.toString() !== userId) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      await page.deleteOne();
      res.status(200).json({ message: "Page deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting page", error });
    }
  },
};