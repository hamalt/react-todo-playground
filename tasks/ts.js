import gulp from 'gulp';
// import gulpTs from 'gulp-typescript';
import plumber from 'gulp-plumber';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import tsify from 'tsify';
import watchify from 'watchify';
import fancy_log from 'fancy-log';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import buffer from 'vinyl-buffer';

import { ts as config, isProd } from './config';

// TypeScriptの設定取得
// const tsProject = gulpTs.createProject('tsconfig.json');

// fancy-logをエクスポート（Gulp構成ファイルでの用途）
export const fancyLog = fancy_log;

// Watchifyの設定
export const watchedBrowserify = watchify(
  browserify({
    basedir: ".",
    debug: true,
    entries: [config.src],
    cache: {},
    packageCache: {},
  })
);

function typeScript() {
  // TODO: Babelifyの設定途中。エラーが出る。
  return watchedBrowserify
    .plugin(tsify)
    .transform('babelify', {
      presets: ['@babel/preset-env', '@babel/preset-typescript'],
      extensions: ['.ts'],
    })
    .bundle()
    .on('error', fancy_log)
    .pipe(plumber())
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.dest));


  // gulp
  //   .src(config.src)//tsファイルがディレクトリを記述してください。
  //   .pipe(plumber())
  //   .pipe(tsProject())
  //   .on('error', function (e) {
  //     console.log('e:', e);
  //   })
  //   .pipe(
  //     babel({
  //       presets: ['@babel/preset-env'],
  //       comments: false,
  //     })
  //   )
  //   .pipe(changed(dist.root))
  //   .pipe(gulp.dest(config.dest));
  // cb();
  // return tsProject
  //   .src()
  //   .pipe(plumber())
  //   .pipe(tsProject())
  //   .js.pipe(gulp.dest(config.dest));
}

export const ts = gulp.series(typeScript);

// gulp.task("default", gulp.series(gulp.parallel("copy-html"), bundle));
// watchedBrowserify.on('update', typeScript);
// watchedBrowserify.on("update", bundle);
// watchedBrowserify.on("log", fancy_log);
