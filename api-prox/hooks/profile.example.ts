// хук меняет юзернейм 'Anixart' на 'Anixartiki'

import { logger } from "../shared";

export function match(path: string): boolean {
  // id профиля 1, это профиль Anixart (разработчиков)
  if (path == "/profile/1") return true;
  return false;
}

export async function get(data: any, url: URL) {
  const newUname = "Anixartiki";

  // проверяем что есть поле 'profile' и оно не равно 'null', что значит что мы получили данные с апи и можно двигаться дальше
  // иначе возвращаем оригинальные данные
  if (!data.hasOwnProperty("profile") || !data.profile) return data;

  // выводим сообщение в лог, если уровень логгера 'debug'
  logger.debugHook(
    `Changed username of '${data["profile"]["login"]}' (${data["profile"]["id"]}) to ${newUname}`
  );

  // меняем поле на новый юзернейм
  data["profile"]["login"] = newUname;

  // возвращаем изменённые данные
  return data;
}
