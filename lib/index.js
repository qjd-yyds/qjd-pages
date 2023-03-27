const { src, dest, parallel, series, watch } = require("gulp");
const bs = require("browser-sync").create();
const del = require("del");
const loadPlugins = require("gulp-load-plugins");
const cwd = process.cwd();
// 使用loadPlugins简化上述插件引入
const plugins = loadPlugins();
const { babel, sass, swig, imagemin } = plugins;
let config = {
    // defaultconfig
    build: {
        src: "src",
        dist: "dist",
        temp: "temp",
        public: "public",
        paths: {
            styles: "assets/styles/*.scss",
            scripts: "assets/scripts/*.js",
            pages: "*.html",
            images: "assets/images/**",
            fonts: "assets/fonts/**"
        }
    }
};
try {
    const loadConfig = require(`${ cwd }/page.config.js`);
    config = Object.assign({}, config, loadConfig);
} catch (e) {

}
//clean任务 清除dist目录
const clean = () => {
    return del([ config.build.dist, config.build.temp ]);
};
// 样式编译任务
const style = () => {
    const hanldeSass = sass(require("sass")); // 新版本sass处理为需要导入sass
    return src(config.build.paths.styles, { base: config.build.src, cwd: config.build.src })
        // .pipe(sass())
        .pipe(hanldeSass())
        .pipe(dest(config.build.temp));
};
// 脚本编译任务
const script = () => {
    return src(config.build.paths.scripts, { base: config.build.src, cwd: config.build.src })
        .pipe(babel(
            {
                presets: [ require("@babel/preset-env") ]
            }
        ))
        .pipe(dest(config.build.temp));
};
// 页面文件编译
const page = () => {
    return src(config.build.paths.pages, { base: config.build.src, cwd: config.build.src })
        .pipe(swig({ data: config.data }))
        .pipe(dest(config.build.temp));
};
// 处理字体文件和图片文件
const image = () => {
    return src(config.build.paths.images, { base: config.build.src, cwd: config.build.src })
        .pipe(imagemin())
        .pipe(dest(config.build.dist));
};
const fonts = () => {
    return src(config.build.paths.fonts, { base: config.build.src, cwd: config.build.src })
        .pipe(imagemin())
        .pipe(dest(config.build.dist));
};
const extra = () => {
    return src("**", { base: config.build.public, cwd: config.build.public })
        .pipe(dest(config.build.dist));
};
// 处理压缩和html里的路径问题，自动合并build-endbuild之间的代码
const useref = () => {
    return src(config.build.paths.pages, { base: config.build.temp, cwd: config.build.temp })
        .pipe(plugins.useref({ searchPath: [ config.build.temp, "." ] }))
        .pipe(plugins.if(/\.js$/, plugins.uglify()))
        .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
        .pipe(plugins.if(/\.html$/, plugins.htmlmin(
            {
                collapseWhitespace: true,
                minifyCss: true,
                minifyJS: true
            }
        )))
        // 对js css html 进行压缩
        // dest读取 dest写入造成文件冲突
        .pipe(dest(config.build.dist));
};
// 并行
const compile = parallel(style, script, page);
// 打包
const build = series(clean, parallel(series(compile, useref), image, fonts, extra));
const serve = () => {
    watch(config.build.paths.styles, { cwd: config.build.src }, style);
    watch(config.build.paths.scripts, { cwd: config.build.src }, script);
    watch(config.build.paths.pages, { cwd: config.build.src }, page);
    watch([ config.build.paths.images, config.build.paths.fonts ], bs.reload);
    watch("**", { cwd: config.build.public }, bs.reload);
    bs.init({
        notify: false,
        port: 4389,
        files: "temp/**",
        server: {
            baseDir: [ config.build.temp, config.build.src, config.build.public ],
            routes: {
                "/node_modules": "node_modules"
            }
        }
    });
};
const dev = series(clean, compile, serve);
module.exports = {
    clean,
    build,
    dev
};