# AniX - Player Parsers

Данный под-проект позволяет получить прямые ссылки на видеофайлы с источников Sibnet, Kodik, Anilibria (источник: libria)

Он может использоваться как для основного проекта AniX, так и как отдельный сервис.

В основном проекте, парсеры используются для работы своего плеера, если вам не важна данная функция, вы можете не развёртывать данный суб-сервис.

Лицензия: [MIT](../LICENSE)

## Использование

В строке веб-браузера необходимо ввести:

`<http|https>://<ip|domain><:port>/?url=<VIDEO_URL>&player=<PLAYER_SOURCE>`

где:

- http|https - схема по которой будет осуществляться подключение к сервису
- ip|domain - IP адрес или домен на котором находится сервис
- :port - порт сервиса, опционально
- VIDEO_URL - ссылка на видео от источника
- PLAYER_SOURCE - источник, один из: kodik, sibnet, libria

Ответ:

- 500|400: произошла ошибка, подробнее в строке `message` в теле ответа
- 200: запрос прошёл успешно

## Развёртывание

> [!IMPORTANT]
> В связи с спецификой источников, рекомендуется использовать виртуальный сервер в россии, т.к. они могут быть недоступны из других стран.
>
> Из-за данной специфики, парсеры невозможно развернуть на edge сервисах, таких как Cloudflare Workers или Deno, а только на отдельном сервере.

### Docker

Требования:

- [docker](https://docs.docker.com/engine/install/)

### Пре-билд

1. выполните команду:

`docker run -d --name anix-player -p 7000:7000 radiquum/anix-player-parser:latest`

### Ручной билд

Доп. Требования:

- [git](https://git-scm.com/)

1. Клонируйте репозиторий `git clone https://github.com/Radiquum/AniX`
2. Переместитесь в директорию репозитория `cd AniX`
3. Переместитесь в директорию парсеров `cd player-parsers`
4. Выполните команду `docker build -t anix-player-parser .`
5. После окончания, выполните команду: `docker run -d --restart always --name anix-player -p 7000:7000 anix-player-parser`

### docker/Обозначения

- -d - запустить контейнер в фоне
- --restart always - всегда запускать после перезагрузки сервера
- --name - название контейнера
- -p - порт контейнера который будет доступен извне. ПОРТ:7000

### docker/После развёртывания

Сервис будет доступен по адресу: `http://<ВАШ IP><:ВАШ ПОРТ>/`

### docker/Примечание

Для использования своего домена и поддержки протокола HTTPS, вы можете использовать Traefik или другой reverse-proxy, с сертификатом SSL.

Полезные ссылки:

- [Конвертер из команды docker run в синтакс для docker compose](https://it-tools.tech/docker-run-to-docker-compose-converter)
- [Как настроить Traefik + свой домен + SSL](https://letmegooglethat.com/?q=how+to+setup+traefik+with+custom+domain+and+ssl+certificate+from+lets+encrypt%3F)

### pm2

Требования:

- [git](https://git-scm.com/)
- [nodejs 23+ с npm](http://nodejs.org/)
- [pm2](https://pm2.keymetrics.io/)

Инструкция:

1. Клонируйте репозиторий `git clone https://github.com/Radiquum/AniX`
2. Переместитесь в директорию репозитория `cd AniX`
3. Переместитесь в директорию парсеров `cd player-parsers`
4. Выполните команду `npm install`
5. После окончания и выполните команду `pm2 start index.ts -n anix-player-parser`

### pm2/Обозначения

- -n - название сервиса в pm2

### pm2/После развёртывания

Сервис будет доступен по адресу: `http://<ВАШ IP>:7000/`

### pm2/Примечание

Для автоматического запуска приложения, рекомендуется настроить pm2 на автозапуск, с помощью команды: `pm2 startup`

Полезные ссылки:

- [PM2: подходим к вопросу процесс-менеджмента с умом @ Habr](https://habr.com/ru/articles/480670/)
