import fs from "fs";

/**
 * Удаление файла или категории по пути
 * @param {*} link Ссылка на файл/категорию.
 */
export const fileRemove = async (link) => {
  if (link && link !== "" && link !== "false") {
    let removeFile = link.split("images/").pop();
    if (fs.existsSync(`images/${removeFile}`))
      fs.unlinkSync(`images/${removeFile}`);
  } else {
    return "";
  }
};
