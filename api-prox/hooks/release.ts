// хук добавляет рейтинг шикимори в поле note релиза

export function match(path: string): boolean {
  // используем только страницы с путём /release/<id>
  const pathRe = /\/release\/\d+/;
  if (pathRe.test(path)) return true;
  return false;
}

const timeout = 5000; // таймаут запроса к внешнему апи на 5 секунд

async function fetchShikiRating(title: string) {
  try {
    // ищём аниме на шикимори по названию, т.к. ид аниме аниксарт и шикимори разные и нет никакого референса друг на друга
    const shikiIdRes = await fetch(
      `https://shikimori.one/api/animes?search=${title}`,
      { signal: AbortSignal.timeout(timeout) }
    );
    if (!shikiIdRes.ok) throw new Error(); // если при поиске произошла ошибка, то возвращаем null

    const shikiIdJson = await shikiIdRes.json();
    if (shikiIdJson.length == 0) throw new Error(); // если нет результатов, то возвращаем null

    // берём ид от первого результата
    const shikiId = shikiIdJson[0]["id"];

    // повторяем процесс, уже с ид от шикимори
    const shikiAnimRes = await fetch(
      `https://shikimori.one/api/animes/${shikiId}`,
      { signal: AbortSignal.timeout(timeout) }
    );
    if (!shikiAnimRes.ok) throw new Error(); // если при произошла ошибка, то возвращаем null
    const shikiAnimJson = await shikiAnimRes.json();

    // возвращаем рейтинг
    return Number(shikiAnimJson.score);
  } catch {
    return null;
  }
}

async function fetchMALRating(title: string) {
  try {
    // ищём аниме на MAL по названию, через API Jikan, т.к. ид аниме аниксарт и шикимори разные и нет никакого референса друг на друга
    const malRes = await fetch(`https://api.jikan.moe/v4/anime?q=${title}`, {
      signal: AbortSignal.timeout(timeout),
    });
    if (!malRes.ok) throw new Error(); // если при поиске произошла ошибка, то возвращаем null

    const malJson = await malRes.json();
    if (malJson.data.length == 0) throw new Error(); // если нет результатов, то возвращаем null
    // возвращаем рейтинг от первого результата
    return Number(malJson.data[0].score);
  } catch {
    return null;
  }
}

export async function get(data: any, url: URL) {
  // проверяем что есть поле 'release'
  // иначе возвращаем оригинальные данные
  if (!data.hasOwnProperty("release")) return data;

  const shikimoriRating = await fetchShikiRating(
    data["release"]["title_original"]
  );
  const malRating = await fetchMALRating(data["release"]["title_original"]);

  // пушим строки в список, что-бы было легче их объединить
  const noteBuilder = [];
  if (data["release"]["note"]) noteBuilder.push(`${data.release.note}`); // первым добавляем оригинальное значение примечания, если оно есть
  data["release"]["note"] &&
    (shikimoriRating || malRating) &&
    noteBuilder.push("------"); // добавляем разделитель, если есть рейтинг и оригинальное примечание
  shikimoriRating &&
    noteBuilder.push(`<b>Рейтинг Shikimori:</b> ${shikimoriRating}★`); // добавляем рейтинг от шикимори
  malRating && noteBuilder.push(`<b>Рейтинг My Anime List:</b> ${malRating}★`); // добавляем рейтинг от MAL
  data["release"]["note"] = noteBuilder.join("<br/>"); // заменяем оригинальное поле нашей строкой

  // возвращаем изменённые данные
  return data;
}
