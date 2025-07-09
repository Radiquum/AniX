# Развёртывание приложения AniX

## Vercel

Требования:

- аккаунт GitHub
- аккаунт Vercel

1. Создайте форк репозитория

    ![fork button](./docs/deploy/fork.png)

2. Войдите в аккаунт Vercel

> [!IMPORTANT]
> Аккаунт Vercel должен быть связан с аккаунтом GitHub.
>
> Если у вас нет аккаунта Vercel, то создайте его через вход с помощью GitHub.

3. Нажмите кнопку создать новый проект

    ![vercel new project button](./docs/deploy/vercel_new_project.png)

4. Нажмите кнопку импортировать напротив названия репозитория

    ![vercel import button](./docs/deploy/vercel_import.png)

5. (опционально) добавьте переменные для использования своего плеера и\или API прокси:

   - NEXT_PUBLIC_PLAYER_PARSER_URL
   - NEXT_PUBLIC_API_URL

    на те которые вы получили, если развёртывали [anix-player-parser](./player-parser/README.RU.md) и/или [anix-api-prox](./api-prox/README.RU.md)

    ![vercel project settings](./docs/deploy/vercel_project.png)

6. нажмите кнопку "Deploy" и ожидайте пока не появится подтверждение
7. нажмите кнопку "Continue to Dashboard"
8. клиент будет доступен по ссылке такого вида, нажмите на неё чтобы его открыть
    ![vercel project url](./docs/deploy/vercel_url.png)

## Netlify

Требования:

- аккаунт GitHub
- аккаунт Netlify

1. Создайте форк репозитория

    ![fork button](./docs/deploy/fork.png)

2. Войдите в аккаунт Netlify

> [!IMPORTANT]
> Аккаунт Netlify должен быть связан с аккаунтом GitHub.
>
> Если у вас нет аккаунта Netlify, то создайте его через вход с помощью GitHub.

3. Нажмите кнопку создать новый проект

    ![netlify new project button](./docs/deploy/netlify_new_project.png)

4. Нажмите кнопку GitHub

    ![netlify provider choice](./docs/deploy/netlify_provider.png)

5. Нажмите на название репозитория

    ![netlify import button](./docs/deploy/netlify_import.png)

6. (опционально) заполните название проекта

    ![netlify project name](./docs/deploy/netlify_project_name.png)

7. (опционально) добавьте переменную для использования своего плеера и\или API прокси::

   - NEXT_PUBLIC_PLAYER_PARSER_URL
   - NEXT_PUBLIC_API_URL

    на те которые вы получили, если развёртывали [anix-player-parser](./player-parser/README.RU.md) и/или [anix-api-prox](./api-prox/README.RU.md)

    1. ![alt text](./docs/deploy/netlify_env_1.png)

    2. ![alt text](./docs/deploy/netlify_env_2.png)

8. нажмите кнопку "Deploy" и ожидайте пока не появится подтверждение

9. клиент будет доступен по ссылке такого вида, нажмите на неё чтобы его открыть

    ![netlify project url](./docs/deploy/netlify_url.png)

## Docker

Требования:

- [docker](https://docs.docker.com/engine/install/)

### Пре-билд

1. выполните команду:

`docker run -d --name anix -p 3000:3000 radiquum/anix:latest`

### Ручной билд

Доп. Требования:

- [git](https://git-scm.com/)

1. Клонируйте репозиторий `git clone https://github.com/Radiquum/AniX`
2. Переместитесь в директорию репозитория `cd AniX`
3. Выполните команду `docker build -t anix .`
4. После окончания, выполните команду: `docker run -d --restart always --name anix -p 3000:3000 anix`

### docker/Обозначения

- -d - запустить контейнер в фоне
- --restart always - всегда запускать после перезагрузки сервера
- --name - название контейнера
- -p - порт контейнера который будет доступен извне. ПОРТ:3000

> [!NOTE]
> для переменных которые вы получили, если развёртывали [anix-player-parser](./player-parser/README.RU.md) и/или [anix-api-prox](./api-prox/README.RU.md), необходимо использовать `-e ПЕРЕМЕННАЯ=ЗНАЧЕНИЕ` до последнего слова anix

[команда docker run](https://docs.docker.com/reference/cli/docker/container/run/)

### docker/После развёртывания

Сервис будет доступен по адресу: `http://<ВАШ IP><:ВАШ ПОРТ>/`

### docker/Примечание

Для использования своего домена и поддержки протокола HTTPS, вы можете использовать Traefik или другой reverse-proxy, с сертификатом SSL.

Полезные ссылки:

- [Конвертер из команды docker run в синтакс для docker compose](https://it-tools.tech/docker-run-to-docker-compose-converter)
- [Как настроить Traefik + свой домен + SSL](https://letmegooglethat.com/?q=how+to+setup+traefik+with+custom+domain+and+ssl+certificate+from+lets+encrypt%3F)

## pm2

Требования:

- [git](https://git-scm.com/)
- [nodejs 23+ с npm](http://nodejs.org/)
- [pm2](https://pm2.keymetrics.io/)

Инструкция:

1. Клонируйте репозиторий `git clone https://github.com/Radiquum/AniX`
2. Переместитесь в директорию репозитория `cd AniX`
3. Выполните команду `npm install`
4. (опционально) скопируйте .env.sample как .env и заполните его переменными которые вы получили, если развёртывали [anix-player-parser](./player-parser/README.RU.md) и/или [anix-api-prox](./api-prox/README.RU.md)
5. Выполните команду `npm run build`
6. создайте новую директорию (далее будем использовать `<имя_новой_директории>` как её имя)
7. переместите в созданную директорию (`<имя_новой_директории>`)
    - директорию `public` в `<имя_новой_директории>/public`
    - директорию `.next/static` в `<имя_новой_директории>/.next/static`
    - файлы из `.next/standalone` в `<имя_новой_директории>`
8. Переместитесь в созданную директорию и выполните команду `pm2 start server.js -n anix`

### pm2/Обозначения

- -n - название сервиса в pm2

### pm2/После развёртывания

Сервис будет доступен по адресу: `http://<ВАШ IP>:3000/`

### pm2/Примечание

Для автоматического запуска приложения, рекомендуется настроить pm2 на автозапуск, с помощью команды: `pm2 startup`

Полезные ссылки:

- [PM2: подходим к вопросу процесс-менеджмента с умом @ Habr](https://habr.com/ru/articles/480670/)
