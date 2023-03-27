# qjd-pages
一个pagescli工具
## 安装
```bash
npm i qjd-pages
```
## 使用
```json
{
  "scripts": {
      "dev": "qjd-pages dev",
      "build": "qjd-pages build",
      "clean": "qjd-pages clean"
  }
}
```
+ 开发环境：使用dev命令创建一个开发环境
+ 生产环境：使用build命令打包
+ 清除：使用clean 清除产出的文件

需要安装下述的目录创建项目，否则讲无法正常进行构建
## 演示目录结构
+ 默认源代码放在根目录中的src文件中
+ assets 存放静态目录
  + fonts存放字体文件
  + images存放图片
  + scripts存放js文件
  + styles 存放样式文件，目前只支持了scss编译
+ html 可以在src的任意地方放置html

```text
src
├── about.html
├── assets
│   ├── fonts
│   │   ├── pages.eot
│   │   ├── pages.svg
│   │   ├── pages.ttf
│   │   └── pages.woff
│   ├── images
│   │   ├── brands.svg
│   │   └── logo.png
│   ├── scripts
│   │   └── main.js
│   └── styles
│       ├── _icons.scss
│       ├── _variables.scss
│       ├── demo.scss
│       └── main.scss
├── features.html
├── index.html
├── layouts
│   └── basic.html
└── partials
    ├── footer.html
    ├── header.html
    └── tags.html

```
可以使用下述配置来对源代码目录进行配置，如修改源代码的目录
## 配置
```js
// 新建 page.config.js
module.exports = {
    data: {}, // 需要传递给html的参数 可以用于模板引擎swig的使用
    // 默认配置在下方
    build: {
        src: "src", // 可以修改源代码存放位置
        dist: "release", // 打包产出的目标文件名称
        temp: ".temp", // 临时托管文件
        public: "public", // 不参与构建的文件
        // 静态资源存放默认配置，默认存放在src下的assets中
        // 其中html为src中的全目录
        paths: {
            styles: "assets/styles/*.scss",
            scripts: "assets/scripts/*.js",
            pages: "*.html",
            images: "assets/images/**",
            fonts: "assets/fonts/**"
        }
    }
};
```