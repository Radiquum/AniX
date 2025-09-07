// хук добавляет рейтинг Shikimori и MAL в поле note релиза
import { InfoLogger } from "../utils/logger.js";
import { tryCatch } from "../utils/tryCatch.js";

const title = "show3rdPartyReleaseRating.ts";
const description = "Добавление рейтингов от Shikimori и MAL на страницу релиза";
const priority = 0;

function match(url: URL, method: "GET" | "POST"): boolean {
  const pathRe = /\/release\/\d+/;
  return pathRe.test(url.pathname) && method == "GET";
}

const timeout = 5000; // таймаут в миллисекундах, если запрос рейтинга происходит слишком долго

async function getShikimoriRating(title: string) {
  // ищём аниме на шикимори по названию, т.к. ид аниме аниксарт и шикимори разные и нет никакого референса друг на друга
  const { data, error } = await tryCatch(
    fetch(`https://shikimori.one/api/animes?search=${title}`, {
      signal: AbortSignal.timeout(timeout),
    })
  );

  if (error || !data.ok) return null; // если при поиске произошла ошибка, то возвращаем null
  const searchJson: any = await data.json();
  if (searchJson.length == 0) return null; // если нет результатов, то возвращаем null

  // берём ид от первого результата
  const shikiId = searchJson[0]["id"];

  // повторяем процесс, уже с ид от шикимори
  const { data: shikiData, error: shikiError } = await tryCatch(
    fetch(`https://shikimori.one/api/animes/${shikiId}`, {
      signal: AbortSignal.timeout(timeout),
    })
  );

  if (shikiError || !shikiData.ok) return null; // если при произошла ошибка, то возвращаем null

  // возвращаем рейтинг
  const shikiJson: any = await shikiData.json();
  return Number(shikiJson.score);
}

async function getMALRating(title: string) {
  // ищём аниме на MAL по названию, через API Jikan, т.к. ид аниме аниксарт и шикимори разные и нет никакого референса друг на друга
  const { data, error } = await tryCatch(
    fetch(`https://api.jikan.moe/v4/anime?q=${title}`, {
      signal: AbortSignal.timeout(timeout),
    })
  );

  if (error || !data.ok) return null; // если при поиске произошла ошибка, то возвращаем null
  const malJson: any = await data.json();
  if (malJson.data.length == 0) return null; // если нет результатов, то возвращаем null

  // возвращаем рейтинг от первого результата
  return Number(malJson.data[0].score);
}

async function hook(data: any, _: URL, __: "GET" | "POST") {
  // проверяем что есть поле 'release'
  // иначе возвращаем оригинальные данные
  if (!data.hasOwnProperty("release")) return data;

  // ищем рейтинг
  const shikiRating = await getShikimoriRating(data.release.title_original);
  const malRating = await getMALRating(data.release.title_original);

  // добавляем рейтинг
  // пушим строки в список, что-бы было легче их объединить
  const noteBuilder = [];
  if (data.release.note) noteBuilder.push(`${data.release.note}`); // первым добавляем оригинальное значение примечания, если оно есть
  data.release.note && (shikiRating || malRating) && noteBuilder.push("-".repeat(100)); // добавляем разделитель, если есть рейтинг и оригинальное примечание
  shikiRating && noteBuilder.push(`<b>Рейтинг Shikimori:</b> ${shikiRating}★`); // добавляем рейтинг от шикимори
  malRating && noteBuilder.push(`<b>Рейтинг My Anime List:</b> ${malRating}★`); // добавляем рейтинг от MAL
  data.release.note = noteBuilder.join("<br/>"); // заменяем оригинальное поле нашей строкой

  InfoLogger(title, "Fetched and set 3rd party rating as note");
  // возвращаем изменённые данные
  return data;
}

const entrypoint = { title, description, priority, match, hook };
export default entrypoint;
