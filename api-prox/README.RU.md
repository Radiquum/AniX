# AniX - Api Proxy

Этот подпроект позволяет проксировать запросы к Anixart API и изменять их ответы с помощью хуков.

Его можно использовать как для основного проекта AniX, так и как отдельный сервис для Android-приложения с изменённой ссылкой на API через [anixart-patcher](https://github.com/radiquum/anixart-patcher).

Лицензия: [MIT](./LICENSE)

## Структура

Проект имеет следующую структуру

```md
.
├── src
│   ├── hooks
│   │   ├── index.ts - функции для запуска хуков
│   │   ├── enabledHooks.ts - список включённых хуков
│   │   ├── hook1.ts - файл(ы) хуков
│   │   ├── ...
│   ├── json
│   │   └── file.json - json-файлы для импорта в хуки в качестве хранилища данных
│   ├── utils
│   │   ├── info.ts - функции информации для api-prox
│   │   ├── logger.ts - функции логирования для api-prox
│   │   └── tryCatch.ts - обёртка tryCatch для асинхронных функций вроде fetch
│   ├── config.ts - конфигурация api-prox
│   └── index.ts - точка входа и обработка маршрутов
├── .dockerignore
├── .gitignore
├── .vercelignore
├── bun.lock
├── bun.ts - файл для запуска через bun
├── deno.json
├── deno.lock
├── deno.ts - файл для запуска через deno
├── Dockerfile
├── LICENSE
├── node.ts - файл для запуска через node
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
├── vercel.json
└── wrangler.jsonc
```

В проекте используется фреймворк Hono для запуска на нескольких serverless-платформах.

Протестировано на следующих платформах:

- CloudFlare Workers

- Vercel Functions

- Deno Deploy

## Использование

Для доступа к главной странице введите url развернутого проекта: `<http|https>://<ip|домен><:порт>/<ENDPOINT>[?<QUERY_PARAMS>]`

Доступные эндпоинты:

- `GET /` - главная страница, как начать работу с вашим деплоем

- `GET /health` - страница состояния, информация о версии и включённых хуках

- `GET /health/json` - то же самое, но в формате json

- `GET|POST /*` - проксирует pathname и query на сервер anixart

### Ответ

200: запрос к прокси был успешен

если страница не найдена: возвращается json с `{"message": <причина>, "code": 404}`

если API вернул ненулевой код: возвращается json с `{"message": <причина>, "code": <код из ответа api>}`

## Хуки

Хуки - это функции с сопоставителем, которые изменяют ответ API.

### Тип

```ts
export type Hook = {
  title: string;
  description: string | null;
  priority: number;
  match: (url: URL, method: "GET" | "POST") => boolean;
  hook: (url: URL, data: any, method: "GET" | "POST") => Promise<any>;
};
```

Заголовки и описания будут использоваться для отображения включённого хука на эндпоинте `/health`.

Чтобы посмотреть, как писать хук, можно использовать встроенные хуки в качестве примера:

- [addUserRoles.ts](./src/hooks/addUserRoles.ts)
- [show3rdPartyReleaseRating.ts](./src/hooks/show3rdPartyReleaseRating.ts)

Чтобы включить хук, нужно импортировать его в [enabledHooks.ts](./src/hooks/enabledHooks.ts) и добавить в список `enabledHooks`.

## Деплой

### Облачные платформы

1. Клонируйте репозиторий

    ```sh
    git clone https://github.com/Radiquum/AniX.git
    ```

2. Установите зависимости

    Для CloudFlare workers / Vercel functions

    ```sh
    npm install
    ```

    Для Deno deploy

    ```sh
    deno install
    ```

3. При необходимости измените конфиг и хуки (как в docker из шага 6)

4. Разверните проект

    CloudFlare workers

    ```sh
    npm run cf-deploy
    ```

    Vercel functions

    ```sh
    npm run vc-deploy
    ```

    Deno deploy

    ```sh
    deno run deno-deploy
    ```

### Docker

Требования:

- [docker engine](https://docs.docker.com/engine/install/)
- Linux-система или WSL

### Готовый образ

1. Выполните команду:

```sh
docker run -d --restart always --name anix-api -p 7001:7001 radiquum/anix-api-prox:latest
```

### Ручная сборка

Дополнительные требования:

- [git](https://git-scm.com/)

1. Клонируйте репозиторий: `git clone https://github.com/Radiquum/AniX`
2. Перейдите в директорию репозитория: cd AniX
3. Перейдите в директорию сервиса: cd api-prox
4. Выполните команду: docker build -t anix-api-prox .
5. После завершения выполните: docker run -d --restart always --name anix-api-prox -p 7001:7001 anix-api-prox

### Как использовать хуки

1. создайте папку hooks и добавьте флаг

    `-v ./hooks:/app/src/hooks/custom`

    перед флагом `-p`.

2. сделайте то же самое для папки json

    `-v ./json:/app/src/json/custom`

3. создайте файл `enabledHooks.ts` со следующим содержимым и подключите его к контейнеру через

    `-v ./enabledHooks.ts:/app/src/hooks/enabledHooks.ts`

    ```ts
    import { Hook } from "./index.js";

    export const enabledHooks: Hook[] = [];
    export default enabledHooks;
    ```

    Это отключит встроенные хуки.

4. Разместите свои хуки в директории hooks на хосте.

5. Разместите свои json-файлы в директории json на хосте.

6. Импортируйте хук в `enabledHooks.ts`

    ```ts
    import MyHook from "./custom/MyHook.js"
    ```

    Чтобы импортировать json-файл внутри хука:

    ```ts
    import MyJson from "../../json/custom/MyJson.json" with {"type": "json"};
    ```

7. Добавьте свой хук в список включённых хуков в `enabledHooks.ts`:

    ```ts
    ...
    export const enabledHooks: Hook[] = [MyHook];
    ...
    ```

8. Запустите или перезапустите контейнер.

## Разработка

Проект предоставляет несколько команд для разработки.

Cloudflare workers:

```sh
npm run cf-dev
```

Vercel Functions:

```sh
npm run vc-dev
```

Bun:

```sh
bun run bun-dev
```

Deno:

```sh
deno run deno-dev
```

Node:

```sh
npm run node-dev
```

## Отчёты о проблемах

Чтобы сообщить об ошибке или запросить функцию, используйте вкладку Issues основного репозитория с заголовком:

`API-PROX/<BUG|REQUEST>: <Ваш заголовок>`

## Вклад

Мы приветствуем любые вклады в проект! Если у вас есть исправления ошибок, улучшения или новые функции  создайте pull request или issue.
