# Проект "Электронная сервисная книжка Мой Силант"

1. Установить проект по ссылке GitHub SSH:

### `git clone git@github.com:codewarrior888/FinalProject.git`

или скачать по ссылке:
### `https://github.com/codewarrior888/FinalProject.git`

2. Открыть проект в IDE и запустить виртуальное окружение:

### `python3 -m venv .venv`
### `source .venv/bin/activate`

3. Перейти в папку и установить все зависимости:
### `cd backend/mysilant/`
### `pip install -r requirements.txt`

4. Запустить сервер:
### `python manage.py runserver`

5. В номом окне терминала перейдите в папку:

### `cd frontend/`

6. Установите все зависимости:

### `npm install`

7. Запустить dev-сервер:

### `npm start`

Серверная часть доступна по ссылке [http://127.0.0.1:8000/](http://127.0.0.1:8000/).
Доступ в админ панель [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/).

Данные пользователей (username/password):
- admin/admin;
- client1/tusroN-nysfyq-5hibni
- client2/qygxiz-peXqa8-difceh
- client3/Byfmub-hypme2-codjot
- client4/jybcox-pivcyg-6doNwi
- client5/godzu6-cuzhew-Hornux
- client6/joBnoz-5wommo-rawbud
- client7/rikdon-ryNdi8-boxboj
- service_company1/nosfet-hUtka2-fejgym
- service_company2/dapdeq-3sejwo-vedtyB
- service_company3/qisker-0nevxa-kIwbos

Клиентская часть доступна по ссылке [http://localhost:3000](http://localhost:3000).
API документация доступна для авторизованных пользователей по ссылке [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/).

8. Для установки prod-сервера запустить:
### `npm run build`

Все компоненты React будут правильно сверстаны в production режиме и их сборка будет оптимизирована для лучшей производительности.
Приложение готово к развертыванию!
