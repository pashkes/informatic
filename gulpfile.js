const gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync'),
	cssnano = require('gulp-cssnano'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	babel = require('gulp-babel'),
	del = require('del'),
	gcmq = require('gulp-group-css-media-queries'),
	imagemin = require('gulp-imagemin'),
	imageminPngquant = require('imagemin-pngquant'),
	imageminMozjpeg = require('imagemin-mozjpeg'),
	notify = require('gulp-notify'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	pug = require('gulp-pug'),
	svgo = require('gulp-svgo'),
	postcss = require('gulp-postcss'),
	debug = require('gulp-debug'),
	purgecss = require('gulp-purgecss'),
	g = require('gulp-load-plugins')(),
	svgSymbols = require('gulp-svg-symbols'),
	critical = require('critical'),
	inject = require('gulp-inject-string'),
	postcssPresetEnv = require('postcss-preset-env');
const BABEL_POLYFILL = './node_modules/@babel/polyfill/browser.js';

var PATH = {
	SRC: {
		PUG: 'src/pug/*.pug',
		SASS: [
			'src/sass/**/*.scss',
			'src/sass/**/*.sass'
		],
		JS: [
			BABEL_POLYFILL,
			'node_modules/choices.js/public/assets/scripts/choices.min.js',
			'node_modules/tiny-slider/dist/tiny-slider.js',
			'node_modules/houdinijs/dist/js/houdini.polyfills.js',
			'node_modules/svg4everybody/dist/svg4everybody.min.js',
			'node_modules/focus-visible/dist/focus-visible.min.js',
			'node_modules/smooth-scroll/dist/smooth-scroll.min.js',
			'src/js-src/script.js',
			'src/blocks/**/*.js',
		],
		SPRITE: 'src/img/svg-for-sprite/*.svg'
	},
	PREVIEW: {
		HTML: 'src',
		CSS: 'src/sass/out',
		CSSMIN: 'src/css',
		JS: 'src/js'
	},
	BUILD: {
		HTML: 'build',
		CSS: 'build/css',
		JS: 'build/js',
		IMG: 'build/img',
		FONTS: 'build/fonts',
		ASSETS: 'build/assets',
		PHP: 'build/php'
	},
	LIBS: {
		CSS: [],
		JS: []
	},
	WATCH: {
		PUG: [
			'src/blocks/**/*.pug',
			'src/pug/*.pug'
		],
		SASS: [
			'src/sass/**/*.scss',
			'src/sass/**/*.sass',
			'src/blocks/**/*.scss',
			'src/blocks/**/*.sass'
		],
		JS: [
			'src/js-src/*.js',
			'src/blocks/**/*.js'
		]
	}
}
/****************************************************************
 *                         DEVELOPMENT                          *
 ****************************************************************/
gulp.task('pugDev', function buildHTML() {
	console.log('---------- Обработка Pug ----------');

	return gulp.src(PATH.SRC.PUG)
		.pipe(pug({
				pretty: true
			})
			.on('error', notify.onError(function (err) {
				return {
					title: "PUG error!",
					message: err.message
					// message: "<%= error.message %>"
				}
			})))
		.pipe(gulp.dest(PATH.PREVIEW.HTML))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('sassDev', () => {
	console.log('---------- Обработка Sass Deleting Files----------');
	del([PATH.PREVIEW.CSSMIN + '/**/*.css']);
	console.log('---------- Обработка Sass ----------');
	return gulp.src(PATH.SRC.SASS)
		.pipe(sass().on('error', notify.onError(function (err) {
			return {
				title: "SASS error!",
				message: err.message
			}
		})))
		.pipe(postcss([
			require('postcss-flexbugs-fixes'),
			require('postcss-inline-svg'),
			postcssPresetEnv({
				stage: 0,
				autoprefixer: {
					grid: true
				}
			})
		]))
		.pipe(gcmq())
		.pipe(autoprefixer({
			browsers: ['last 2 versions', '> 3%', 'ie 11'],
			cascade: false
		}))
		.pipe(g.extractMediaQueries())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(debug({
			title: 'обработано sass файлов'
		}))
		.pipe(gulp.dest(PATH.PREVIEW.CSSMIN))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('scriptsDev', () => {
	console.log('---------- Обработка JS ----------');

	return gulp.src(PATH.SRC.JS)
		.pipe(babel({
			presets: ['@babel/env'],
			ignore: [
				'node_modules/houdinijs/dist/js/houdini.polyfills.js',
				'node_modules/tiny-slider/dist/tiny-slider.js',
				'node_modules/svg4everybody/dist/svg4everybody.min.js',
				'node_modules/focus-visible/dist/focus-visible.min.js',
				'node_modules/focus-manager/focusManager.min.js',
				'node_modules/popper.js/dist/umd/popper.min.js',
			'node_modules/tippy.js/umd/index.min.js',
			]
		}))
		.pipe(concat('script.min.js'))
		.pipe(gulp.dest(PATH.PREVIEW.JS))
		.pipe(browserSync.reload({
			stream: true
		}))
})

/****************************************************************
 *                          PUG -> HTML                          *
 ****************************************************************/
gulp.task('pug', function buildHTML() {
	console.log('---------- Обработка Pug ----------');

	return gulp.src(PATH.SRC.PUG)
		.pipe(pug({
				pretty: true
			})
			.on('error', notify.onError(function (err) {
				return {
					title: "PUG error!",
					message: err.message
				}
			})))
		.pipe(gulp.dest(PATH.PREVIEW.HTML))
});



/****************************************************************
 *                          SASS -> CSS                          *
 ****************************************************************/

gulp.task('sass', () => {
	console.log('---------- Обработка Sass Deleting Files----------');
	del([PATH.PREVIEW.CSSMIN + '/**/*.css']);
	console.log('---------- Обработка Sass ----------');
	return gulp.src(PATH.SRC.SASS)
		.pipe(sass().on('error', notify.onError(function (err) {
			return {
				title: "SASS error!",
				message: err.message
			}
		})))
		.pipe(postcss([
			require('postcss-flexbugs-fixes'),
			require('postcss-inline-svg')
		]))
		.pipe(gcmq())
		.pipe(autoprefixer({
			browsers: ['last 2 versions', '> 3%', 'ie 11'],
			cascade: false
		}))
		.pipe(debug({
			title: 'обработано sass файлов'
		}))
		.pipe(gulp.dest(PATH.PREVIEW.CSSMIN))
	// .pipe(browserSync.reload({
	// 	stream: true
	// }))
});


/****************************************************************
 *              				  DELETE UNUSE CSS	                     *
 ****************************************************************/

gulp.task('purgecss', gulp.series('sass', 'pug', () => {
	console.log('---------- Delete unused CSS ----------');
	return gulp.src(PATH.PREVIEW.CSSMIN + '/**/*.css')
		.pipe(
			purgecss({
				content: ['src/**/*.html', 'src/**/*.js'],
				whitelist: []
			})
		)
		.pipe(g.extractMediaQueries())
		.pipe(cssnano({
			reduceIdents: false,
			discardComments: {
				removeAll: true
			},
			 discardUnused: false,
			 zindex: false
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(PATH.PREVIEW.CSSMIN))
		.pipe(browserSync.reload({
			stream: true
		}))
}));

/****************************************************************
 *              				 CRITICAL CSS	                     *
 ****************************************************************/
gulp.task('critical', gulp.series('purgecss', function () {
	console.log('---------- Inline critical CSS ----------');
	return gulp.src(PATH.PREVIEW.HTML + '/**/*.html')
		.pipe(critical.stream({
			base: PATH.PREVIEW.HTML,
			inline: true,
			css: [
				PATH.PREVIEW.CSSMIN + '/style.css'
			],
			minify: true,
			width: 1300,
			height: 900
		}))
		.pipe(inject.replace(`<link rel="preload" href="" as="style" onload="this.onload=null;this.rel='stylesheet'">`, ''))
		.pipe(inject.replace(`<noscript><link rel="stylesheet" href=""></noscript>`, ''))
		.pipe(gulp.dest(PATH.PREVIEW.HTML))
		.on('error', function (err) {
			console.log(err.message);
		})
}));


/****************************************************************
 *                        JAVASCRIPT		                          *
 ****************************************************************/
gulp.task('scripts', function () {
	console.log('---------- Обработка JS ----------');
	return gulp.src(PATH.SRC.JS)
		.pipe(babel({
			presets: ['@babel/env'],
			ignore: [
				'node_modules/tiny-slider/dist/tiny-slider.js',
				'node_modules/houdinijs/dist/js/houdini.polyfills.js',
				'node_modules/svg4everybody/dist/svg4everybody.min.js',
				'node_modules/focus-visible/dist/focus-visible.min.js',
				'node_modules/focus-manager/focusManager.min.js',
				'node_modules/popper.js/dist/umd/popper.min.js',
				'node_modules/tippy.js/umd/index.min.js',
			]
		}))
		.pipe(concat('script.min.js'))
		.pipe(uglify().on('error', notify.onError(function (err) {
			return {
				title: "JSmin error!",
				message: err.message
			}
		})))
		.pipe(gulp.dest(PATH.PREVIEW.JS))
});

/****************************************************************
 *              							  SVG SPRITES                     *
 ****************************************************************/

 gulp.task(`svgmin`, function (done) {
	 gulp
 		.src(PATH.SRC.SPRITE)
 		.pipe(imagemin([
 				imagemin.gifsicle(),
 				imageminMozjpeg(),
 				imageminPngquant()
 			], {
 				verbose: true
 			}))
		.pipe(svgo())
		.pipe(gulp.dest('src/img/svg-for-sprite'));
		done();
 })


gulp.task(`sprites`, (done) => {
	gulp
		.src(PATH.SRC.SPRITE)
		.pipe(imagemin([
				imagemin.gifsicle(),
				imageminMozjpeg(),
				imageminPngquant()
			], {
				verbose: true
			}))
		.pipe(svgo())
		.pipe(svgSymbols({
			templates: [`default-svg`, 'default-demo', 'default-scss']
		}))
		.pipe(gulp.dest(`src/img`));
		done();
});


/****************************************************************
 *                TRACKING CHANGES IN FILES                      *
 ****************************************************************/

gulp.task('watch', gulp.series('sassDev', 'pugDev', 'scriptsDev', () =>{
	browserSync.init({
		server: {
			baseDir: 'src'
		},
		notify: false
	})

	gulp.watch(PATH.WATCH.SASS, gulp.parallel('sassDev'));
	gulp.watch(PATH.WATCH.PUG, gulp.parallel('pugDev'));
	gulp.watch(PATH.WATCH.JS, gulp.parallel('scriptsDev'));
	gulp.watch(PATH.SRC.SPRITE, gulp.parallel('sprites'));

}));




/****************************************************************
 *                   START PREVIEW WATCHING	                    *
 ****************************************************************/
gulp.task('default', gulp.series('watch'));



/****************************************************************
 *                   PROJECT FOR PRODUCTION	                    *
 ****************************************************************/
gulp.task('build', gulp.series('scripts', 'critical',
 	(done) => {
	console.log('---------- Очистка папки BUILD ----------');
	del.sync('build');
	del.sync([PATH.PREVIEW.CSSMIN + '/style.css']);

	console.log('---------- BUILD проекта ----------');

	gulp.src('src/*.html')
		.pipe(gulp.dest(PATH.BUILD.HTML))

	gulp.src(['src/css/*.css'])
		.pipe(gulp.dest(PATH.BUILD.CSS))

	gulp.src('src/js/**/*')
		.pipe(gulp.dest(PATH.BUILD.JS))

	gulp.src(['src/img/**/**.*', '!src/img/svg-symbols.svg', '!src/img/svg-for-sprite/**', '!src/img/**.html', '!src/img/**.scss'])
		.pipe(imagemin([
			imagemin.gifsicle(),
			imageminMozjpeg(),
			imageminPngquant()
		], {
			verbose: true
		}))
		.pipe(svgo())
		.pipe(gulp.dest(PATH.BUILD.IMG))

	gulp.src(['src/img/svg-symbols.svg'])
		.pipe(imagemin([
			imagemin.gifsicle(),
			imageminMozjpeg(),
			imageminPngquant()
		], {
			verbose: true
		}))
		.pipe(gulp.dest(PATH.BUILD.IMG))

	gulp.src(['src/fonts/**'])
		.pipe(gulp.dest(PATH.BUILD.FONTS))

	gulp.src(['src/assets/**'])
		.pipe(gulp.dest(PATH.BUILD.ASSETS))

	gulp.src([
			'src/php/**'
		])
		.pipe(gulp.dest(PATH.BUILD.PHP))

	done();
}));
