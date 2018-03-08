# Стартовый проект с gulp

**GULP** - [http://gulpjs.com/](http://gulpjs.com/)

**HTML шаблонизатор** - [https://mozilla.github.io/nunjucks/api.html](https://mozilla.github.io/nunjucks/api.html)

**LESS** - [http://lesscss.org/](http://lesscss.org/)

-----------------------
<table>
  <thead>
    <tr>
      <th>Команда</th>
      <th>Результат</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td width="30%"><code>npm i</code></td>
      <td width="70%">Установить зависимости</td>
    </tr>
    <tr>
      <td><code>npm start (gulp)</code></td>
      <td>Запустить сборку, сервер и слежение за файлами</td>
    </tr>
    <tr>
      <td><code>npm start ЗАДАЧА (gulp ЗАДАЧА)</code></td>
      <td>Запустить задачу с названием ЗАДАЧА (список задач в <code>./gulpfile.js</code>)</td>
    </tr>
    <tr>
      <td><code>npm run build (gulp build)</code></td>
      <td>Сборка проекта без карт кода (сжатый вид, как результат работы)</td>
    </tr>
  </tbody>
</table>

**В Windows установку пакетов (`npm i`) нужно выполять в терминале, запущенном от имени администратора.**

-----------------------

### Файловая структура

~~~~
├── gulpfile.js               # gulpfile сборщика
├── config.json               # Конфигурационный файл проекта
├── package.json              # Основные зависимости
└── src/                      # Основная папка с проектом
    ├── css/                  # Стили
        ├── less/             # LESS файлы проекта
            ├── base/         # Сброс стилей, переменные, миксины
            ├── sprite/       # Шаблон, по которому генерируются спрайты
            └── styles.less   # Основной LESS файл
        └── csslib/           # CSS библиотеки (например, animate.css)
    ├── fonts/                # Шрифты (может содержать поддиректории)
    ├── html/                 # HTML Шаблоны
        ├── data/             # JSON файл настроек
            └── svg/          # Компилируется при сборке проекта, внутри генерируется файл svg спрайта
        ├── layouts/          # Базовый файл шаблона
        └── index.html        # Главный файл шаблона
    ├── images/               # Картинки
        ├── content/          # Контентные картинки, temp (может содержать поддиректории)
        ├── general/          # Общие картинки для проекта (может содержать поддиректории)
        └── sprite/           # Спрайты
            ├── png/          # Растровые картинки для спрайта sprite.png
            └── svg/          # SVG файлы для спрайта sprite-svg.svg
    ├── js/                   # Скрипты
        └── libs.js           # Файл с объявлениями (необязательно libs.js)
    └── static/               # Общие файлы, которые будут перемещены в корень собранного проекта — фавиконка, robots.txt и т.д.  (может содержать поддиректории)
~~~~
-----------------------

## Подключение файлов js, css

Список используемых файлов указан в `./config.json`. Список файлов и папок, взятых в обработку можно увидеть в терминале, если раскомментировать строку `console.log(lists);` в `gulpfile.js`.

**ВНИМАНИЕ!** `./config.json` — это JSON. Это строгий синтаксис, у последнего элемента в любом контексте не должно быть запятой в конце строки.

### `addCss`

Массив с дополнительными стилевыми файлами `node_modules, bower_components`, компилируются в файл `plugins.min.css`.

```
"addCss": [
  "./node_modules/magnific-popup/dist/magnific-popup.css",
  "./node_modules/slick-carousel/slick/slick.css"
],
```

### `addCssSrc`

Массив с дополнительными стилевыми файлами, которые будут взяты в компиляцию из папки `./src/css/csslib/`, компилируются в файл `plugins.min.css`.

```
"addCssSrc": [
  "./src/css/csslib/*.css"
],
```

### `addJsBefore`

Массив js-файлов, которые будут взяты в обработку (конкатенация/сжатие) ПЕРЕД js-файлами проекта.

Пример, добавляющий в список обрабатываемых js-файлов несколько зависимостей:

```
"addJsBefore": [
  "./node_modules/jquery/dist/jquery.min.js",
  "./node_modules/jquery-migrate/dist/jquery-migrate.min.js",
  "./node_modules/magnific-popup/dist/jquery.magnific-popup.min.js",
  "./node_modules/slick-carousel/slick/slick.min.js"
],
```

### `addJsAfter`

Массив js-файлов, которые будут взяты в обработку (конкатенация/сжатие) ПОСЛЕ сторонних js-файлов.

Пример, добавляющий в конец списка обрабатываемых js-файлов глобальный скрипт.

```
"addJsAfter": [
  "./src/js/libs.js"
],
```

### `copiedJs`

Массив js-файлов, которые копируются в папку сборки, подпапку `js/`


### Пример `./config.json`

```json
{
  "addCss": [
    "./node_modules/magnific-popup/dist/magnific-popup.css",
    "./node_modules/slick-carousel/slick/slick.css"
  ],
  "addCssSrc": [
    "./src/css/csslib/*.css"
  ],
  "addJsBefore": [
    "./node_modules/jquery/dist/jquery.min.js",
    "./node_modules/jquery-migrate/dist/jquery-migrate.min.js",
    "./node_modules/svg4everybody/dist/svg4everybody.js",
    "./node_modules/magnific-popup/dist/jquery.magnific-popup.min.js",
    "./node_modules/slick-carousel/slick/slick.min.js",
    "./node_modules/ismobilejs/isMobile.min.js",
    "./node_modules/swipejs/build/swipe.min.js"
  ],
  "addJsAfter": [
    "./src/js/libs.js"
  ],
  "copiedJs": [],
  "dirs": {
    "srcPath": "./src/",
    "buildPath": "./build/"
  }
}
```

В результате в обработку будут взяты (в указанной последовательности):

```bash
{ css:
   [ './src/css/csslib/*.css',
     './node_modules/magnific-popup/dist/magnific-popup.css',
     './node_modules/slick-carousel/slick/slick.css' ],
  js:
   [ './node_modules/jquery/dist/jquery.min.js',
     './node_modules/jquery-migrate/dist/jquery-migrate.min.js',
     './node_modules/svg4everybody/dist/svg4everybody.js',
     './node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
     './node_modules/slick-carousel/slick/slick.min.js',
     './node_modules/ismobilejs/isMobile.min.js',
     './node_modules/swipejs/build/swipe.min.js',
     './src/js/libs.js' ] }
```
