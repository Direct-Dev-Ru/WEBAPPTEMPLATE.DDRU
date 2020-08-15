// Определяем переменную "preprocessor"
const preprocessor = 'sass'; // Выбор препроцессора в проекте - scss или less
const preprocessorExt = preprocessor === "sass" ? 'scss' : 'less';

// Определяем константы Gulp
const {
  src,
  dest,
  parallel,
  series,
  watch
} = require('gulp');
// Подключаем Browsersync
const browserSync = require('browser-sync').create();
// Подключаем gulp-concat
const concat = require('gulp-concat');
// Подключаем gulp-uglify-es
const uglify = require('gulp-uglify-es').default;
// Подключаем модули gulp-sass и gulp-less
const sass = require('gulp-sass');
const less = require('gulp-less');
// Подключаем Autoprefixer
const autoprefixer = require('gulp-autoprefixer');
// Подключаем модуль gulp-clean-css
const cleancss = require('gulp-clean-css');

// Определяем логику работы Browsersync
function browsersync() {
  browserSync.init({ // Инициализация Browsersync
    server: {
      baseDir: './'
    }, // Указываем папку сервера
    port: 4000,
    notify: false, // Отключаем уведомления
    online: true // Режим работы: true или false
  });
}

//обработчик скриптов проекта
function scripts() {
  return src([ // Берём файлы из источников
      'src/vendors/modernizr/modernizr-3.11.2.min.js', // взяли modernizr 
      'src/js/plugins.js', // взяли что то нужное
      'src/vendors/jquery/jquery-3.5.1.js', // взяли исходник jquery
      'src/vendors/popperjs/popper.js', // взяли исходник popperjs
      'src/vendors/bootstrap/dist/js/bootstrap.js', // взяли исходник bootstrap
      'src/js/main.js', // взяли пользовательские скрипты
    ])
    .pipe(concat('app.min.js')) // Конкатенируем в один файл
    .pipe(uglify()) // Сжимаем JavaScript
    .pipe(dest('app/js/')) // Выгружаем готовый файл в папку назначения
    .pipe(browserSync.stream()); // Триггерим Browsersync для обновления страницы
}

//Обработчик стилей проекта
function styles() {
  return src([      
      'src/css/normalize_1.css',
      'src/css/main_2.css',      
      'src/vendors/bootstrap/dist/css/bootstrap.css',      
      'src/' + preprocessorExt + '/app_3.' + preprocessorExt + '',
      'src/css/app_4.css',
    ]) // Выбираем источники (Bootstrap и собственные стили)
    .pipe(eval(preprocessor)()) // Преобразуем значение переменной "preprocessor" в функцию
    .pipe(concat('app.min.css')) // Конкатенируем в файл app.min.js
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      grid: true
    })) // Создадим префиксы с помощью Autoprefixer
    .pipe(cleancss({
      level: {
        1: {
          specialComments: 0
        }
      },
      format: 'beautify'
    })) // чтобы минифицировать - закомментировать , format: 'beautify' 
    .pipe(dest('app/css/')) // Выгрузим результат в папку "app/css/"
    .pipe(browserSync.stream()); // Сделаем инъекцию в браузер
}

//Компиляция стилей Bootstrap'a
function bootstrap() {
  return src([      
      'src/vendors/bootstrap/scss/bootstrap.scss',      
    ]) // Выбираем источник Bootstrap
    .pipe(sass()) // Преобразуем значение переменной "preprocessor" в функцию
    .pipe(concat('bootstrap.css')) // Конкатенируем в файл src/vendors/bootstrap/dist/css/bootstrap.css
    .pipe(cleancss({
      level: {
        1: {
          specialComments: 0
        }
      },
      format: 'beautify'
    })) // чтобы минифицировать - закомментировать , format: 'beautify' 
    .pipe(dest('src/vendors/bootstrap/dist/css/')); // Выгрузим результат в папку "app/css/"    
}

function startwatch() {

  // Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
  watch(['src/**/*.js', '!app/**/*.min.js'], scripts);
  watch([
    'src/' + preprocessorExt + '/**/*',
    'src/css/*.css',
    'src/vendors/bootstrap/dist/css/bootstrap.css'
  ], styles);
}

// Экспортируем функцию browsersync() как таск browsersync. Значение после знака = это имеющаяся функция.
exports.browsersync = browsersync;
// Экспортируем функцию scripts() в таск scripts
exports.scripts = scripts;
// Экспортируем функцию styles() в таск styles
exports.styles = styles;
//Экспортируем функцию bootstrap() в таск bootstrap
exports.bootstrap = bootstrap;
// Экспортируем дефолтный таск с нужным набором функций
exports.default = parallel(styles, scripts, browsersync, startwatch);
