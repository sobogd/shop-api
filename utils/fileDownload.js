import fs from "fs";
import http from "http";
import https from "https";

/**
 * Функция по загрузке файлов из base64 строки и файлов по ссылке
 */
export const fileDownload = async (image, number, name, folder) => {
  // если не найдена папка для товара - создаем ее
  if (!fs.existsSync(`images/${folder}`)) fs.mkdirSync(`images/${folder}`);
  if (image.indexOf(`images/${folder}`) < 0) {
    // если файл не лежит у нас на сервере
    if (image.indexOf("data:") < 0 && image.indexOf("http") >= 0) {
      // если в поле указана ссылка для скачивания
      // определяем метод: https или http
      const method = image.indexOf("https:") < 0 ? http : https;
      // создаем шаблон имени файла
      const fileTemplate = `images/${folder}/${number}-${name}.${image
        .split("?")[0]
        .split(".")
        .pop()}`;
      // создаем новый файл по шаблону имени
      const newFile = fs.createWriteStream(fileTemplate);
      // загружаем файл по сылке в созданный выше файл
      method.get(image, (response) => {
        response.pipe(newFile);
      });
      // возвращаем ссылку на загруженный файл
      return `/${fileTemplate}`;
    } else if (image.indexOf("data:") >= 0 && image.indexOf("base64") >= 0) {
      // если в поле лежит base64 файл
      const imgBase64 = image.split(";base64,")[1];
      // определяем тип файла
      const type = image.match(/[^:/]\w+(?=;|,)/)[0];
      // создаем шаблон имени файла
      const fileTemplate = `images/${folder}/${number}-${name}.${type}`;
      // загружаем файл из base64 в шаблон
      fs.writeFileSync(fileTemplate, imgBase64, {
        encoding: "base64",
      });
      // возвращаем ссылку на загруженный файл
      return `/${fileTemplate}`;
    } else {
      return "";
    }
  } else {
    // если файл лежит на нашем сервере
    return image;
  }
};
