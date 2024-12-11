import mongoose, { Schema, Document, Model } from "mongoose";

// Интерфейс документа
export interface IPage extends Document {
  title: string;
  content: string;
  ownerId: mongoose.Types.ObjectId; // Ссылка на пользователя
  createdAt: Date;
  updatedAt: Date | null;
  validatePage: () => void;
}

// Интерфейс модели для фабричного метода
interface PageModel extends Model<IPage> {
  createPage: (title: string, content: string, ownerId: mongoose.Types.ObjectId) => IPage;
}

const PageSchema = new Schema<IPage>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Связь с пользователем
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

// Метод экземпляра для валидации
PageSchema.methods.validatePage = function () {
  if (!this.title || !this.content) {
    throw new Error("Title and content are required");
  }
};

// Фабричный метод для создания страниц
PageSchema.statics.createPage = function (title: string, content: string, ownerId: mongoose.Types.ObjectId) {
  const page = new this({ title, content, ownerId });
  page.validatePage(); // Валидация
  return page;
};

export default mongoose.model<IPage, PageModel>("Page", PageSchema);
