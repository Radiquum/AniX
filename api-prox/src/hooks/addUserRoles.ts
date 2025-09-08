// хук добавляет кастомные роли к профилю
import { InfoLogger } from "../utils/logger.js";
import Roles from "../json/userRoles.json" with {"type": "json"};

const title = "addUserRoles.ts";
const description = "Добавление кастомных ролей к профилю";
const priority = 0;

function match(url: URL, method: "GET" | "POST"): boolean {
  const pathRe = /\/profile\/\d+/;
  return pathRe.test(url.pathname) && method == "GET";
}

async function hook(data: any, _: URL, __: "GET" | "POST") {
  // проверяем что есть поле 'profile' и к ID профиля привязаны роли
  // иначе возвращаем оригинальные данные
  if (!data.hasOwnProperty("profile")) return data;
  if (!Roles.user_roles.hasOwnProperty(data.profile.id)) return data;

  // ищём и добавляем роли
  // @ts-ignore
  Roles.user_roles[data.profile.id].forEach((element: number) => {
    const role = Roles.roles.find((role) => role.id == element);
    if (role) data.profile.roles.push(role);
  });
  InfoLogger("addUserRoles.ts", "Added roles for user", data.profile.id);

  // возвращаем изменённые данные
  return data;
}

const entrypoint = { title, description, priority, match, hook };
export default entrypoint;
