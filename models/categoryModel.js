import mongoose from "mongoose";
const { model, Schema } = mongoose;

const categorySchema = new Schema({
  name: String, // название
  parent: String, // родительская категория
  link: String, // ссылка
  description: String, // описание
  sort: Number, // сортировка
  active: Boolean, // активность
  image: String, // изображение
});

export const categoryModel = model("categories", categorySchema);
