// хук добавляет рейтинг шикимори в поле note релиза

export function match(path: string): boolean {
  // используем только страницы с путём /release/<id>
  const pathRe = /\/release\/\d+/
  if (pathRe.test(path)) return true;
  return false;
}

export async function get(data: any, url: URL) {
  // проверяем что есть поле 'release'
  // иначе возвращаем оригинальные данные
  if (!data.hasOwnProperty("release")) return data;

  // ищём аниме на шикимори по названию, т.к. ид аниме аниксарт и шикимори разные и нет никакого референса друг на друга
  const shikiIdRes = await fetch(
    `https://shikimori.one/api/animes?search=${data["release"]["title_original"]}`
  );
  if (!shikiIdRes.ok) return data; // если при поиске произошла ошибка, то возвращаем оригинальные данные
  const shikiIdJson = await shikiIdRes.json();
  if (shikiIdJson.length == 0) return data; // если нет результатов, то возвращаем оригинальные данные

  const shikiId = shikiIdJson[0]["id"]; // берём ид от первого результата

  // повторяем процесс, уже с ид от шикимори
  const shikiAnimRes = await fetch(
    `https://shikimori.one/api/animes/${shikiId}}`
  );
  if (!shikiAnimRes.ok) return data;
  const shikiAnimJson = await shikiAnimRes.json();

  // пушим строки в список, что-бы было легче их объединить
  const noteBuilder = [];
  if (data["release"]["note"] != null) noteBuilder.push(`${data.release.note}<br/>---<br/>`); // если в поле note уже что-то есть, разделяем значение и рейтинг
  noteBuilder.push(`<b>Рейтинг Shikimori:</b> ${shikiAnimJson.score}★`); // добавляем рейтинг от шикимори
  data["release"]["note"] = noteBuilder.toString(); // заменяем оригинальное поле нашей строкой
  data["release"]["id_shikimori"] = shikiId; // добавляем айди шикимори в ответ, потому что почему нет

  // возвращаем изменённые данные
  return data;
}
