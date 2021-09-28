import { categoryModel } from "../models/categoryModel.js";
import { fileDownload } from "../utils/fileDownload.js";
import { fileRemove } from "../utils/fileRemove.js";
import { getQueryParams } from "../utils/getQueryParams.js";
import { logger } from "../utils/logger.js";

// Операции с категориями.
export const categoryResolvers = {
  // Получение данных.
  Query: {
    // Получить список категорий по фильтру.
    async getCategories(_, { parent, page, count, sortBy, order }, __, info) {
      try {
        const sort = { [sortBy]: order };
        const filter = parent ? { parent } : null;
        const skip = count * (page - 1);
        const limit = count;
        const categories = await categoryModel.find(
          filter,
          getQueryParams(info, "getCategories"),
          {
            sort,
            limit,
            skip,
          }
        );
        return categories;
      } catch (err) {
        logger.error(err);
        throw new Error(err);
      }
    },

    // Количество всех категорий.
    async getCategoriesCount(_, { parent }) {
      try {
        const categoriesCount = await categoryModel.count({ parent });
        return categoriesCount;
      } catch (err) {
        logger.error(err);
        throw new Error(err);
      }
    },

    // Получить категорию по её ID.
    async getCategory(_, { id }) {
      try {
        const category = await categoryModel.findOne({ _id: id });
        return category;
      } catch (err) {
        logger.error(err);
        throw new Error(err);
      }
    },
  },

  // Изменения данных.
  Mutation: {
    // Удаление категории по её ID.
    async removeCategory(_, { _id }) {
      try {
        const { image, name } = await categoryModel.findOne({ _id });
        image && (await fileRemove(image));
        await categoryModel.deleteOne({ _id });
        logger.info(`Категория "${name}" удалена.`);
        return true;
      } catch (err) {
        logger.info(err);
        throw new Error(err);
      }
    },

    // Сохранение категории по её ID, если ID нет - добавление новой.
    async saveCategory(
      _,
      { _id, name, parent, link, description, sort, active, image }
    ) {
      try {
        if (_id && _id !== "") {
          // Сохраняем существующую категорию.
          const downloadImage = image
            ? await fileDownload(image, "1", _id, "categories")
            : "";
          await categoryModel.findOneAndUpdate(
            { _id },
            {
              name,
              parent,
              link,
              description,
              sort,
              active,
              image: downloadImage,
            }
          );
          return true;
        } else {
          // Добавляем новую категорию.
          const newCategory = await new categoryModel({
            name,
            parent,
            link,
            description,
            sort,
            active,
          });
          const downloadImage = await fileDownload(
            image,
            "1",
            newCategory._id,
            "categories"
          );
          await newCategory.save();
          await categoryModel.updateOne(
            { _id: newCategory._id },
            { image: downloadImage }
          );
          return true;
        }
      } catch (err) {
        logger.error(err);
        throw new Error(err);
      }
    },
  },
};
