# tiunov.top

Сайт студии: Astro (статический сайт) + админка Sveltia CMS + автозаливка на хостинг по FTP.
Дизайн-система: адаптация Framer, см. `docs/DESIGN.md`.

## Как это работает
1. Вы правите контент в админке `https://tiunov.top/admin/` (или файлы в `src/content`).
2. Админка сохраняет изменения в этот репозиторий.
3. GitHub Actions собирает сайт и заливает папку `dist/` на хостинг по FTP (1–2 минуты).

## Настройка (один раз)
1. **Секреты для заливки.** Settings → Secrets and variables → Actions → New repository secret:
   - `FTP_SERVER`: адрес FTP из DirectAdmin (Управление FTP)
   - `FTP_USERNAME`: логин FTP
   - `FTP_PASSWORD`: пароль FTP
   - `FTP_DIR`: папка сайта, обычно `/domains/tiunov.top/public_html/`
   Пока `FTP_SERVER` пустой, сайт только собирается, без заливки.
2. **Домен.** В DirectAdmin добавить домен `tiunov.top`, у регистратора указать NS-серверы хостинга, выпустить SSL (SSL/TLS Certificates → Let's Encrypt).
3. **Вход в админку.** Открыть `https://tiunov.top/admin/`, выбрать «Sign in with token» и вставить GitHub-токен:
   GitHub → Settings → Developer settings → Fine-grained tokens → доступ только к репозиторию `tiunov.top`, права Contents: Read and write.

## Что где лежит
- `src/data/site.json`: название, контакты, пакеты и цены (в админке: Настройки).
- `src/content/cases`: кейсы. `src/content/blog`: статьи. `src/content/cities`: городские страницы (текст у каждой свой).
- Записи с галочкой «Черновик» на сайт не попадают.
- `formEndpoint` в `site.json`: адрес сервиса, куда уходят заявки с формы. Пока пусто, форма просит написать в Telegram.

## Локально
```
npm ci
npm run dev
```
