# webpack4

## 初始化

### 安装webpack

```shell
npm init -y
npm i webpack webpack-cli webpack-dev-server
```

### 初始化项目目录

```
mkdir src config
touch src/index.js config/webpack.dev.js
```

### 执行首次打包

在webpack4中，无需做任何配置，可以直接对项目进行打包。

```shell
webpack --config=config/webpack.dev.js
```

执行完命令后目会生成一个dist目录，并且里面会有一个`main.js`文件。这说明我们的第一次打包成功了。



## 开启webpack之旅

`config/webpack.dev.js`

```js
const path = require('path');

const config = {
  // 设置当前的打包环境：development/production
  mode: 'development',
  // 设置入口
  entry: {
    main: './src/index.js'
  },
  output: {
    // 输出文件的名称
    filename: '[name]-bundle.js',
    // 输出文件的路径
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  }
};

module.exports = config;
```

`src/index.js`

```js
// 测试内容
console.log(1);
```

`package.json`

```json
"scripts": {
    "build": "webpack --config=config/webpack.dev.js"
}
```

我们先清除一下dist目录的文件，然后再次打包看一下效果。

```shell
rm -rf dist/main.js
npm run build
```

如无意外的话，在dist目录会生成一个`main-bundle.js`，并且里面有我们在`src/index`里面写下的测试内容。

### 本地服务器

当然，我们并不希望每一次都去执行打包的操作。所以我们可以需要配置一下本地服务器。在webpack配置文件里面，我们可以对`devServer`作相应的配置

`config/webpack.dev.js`

```js
const config = {
    // ...
    devServer: {
        // 需要监听的目录
        contentBase: 'dist'
    },
    // ...
}
```



在`dist`目录下，我们先创建一个测试用的`index.html`文件：

`dist/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>webpack体验之旅</title>
</head>
<body>
  <h1>Hello webpack</h1>
  <script type="text/javascript" src="./main-bundle.js"></script>
</body>
</html>
```

然后配置一下启动脚本：

`package.json`

```json
"scripts": {
    "dev": "webpack-dev-sever --config=config/webpack.dev.js"
}
```

在控制台执行以下命令：

```shell
npm run dev
```

执行完后，打开浏览器并输入`localhost:8080`即可以看到我们刚才编辑在`dist/index.html`文件里面的内容，并且在浏览器的控制台里面我们可以看到`src/index.js`里面的`console.log(1)`也没问题。

### 加载样式文件

我们先改变一下文件结构，在`src`目录下面创建一个`styles`的目录，并创建一个`index.css`文件。

```shell
mkdir src/styles
touch src/styles/index.css
```

在`index.css`写上点测试用的样式内容

```css
html, body {
  margin: 0;
  padding: 0;
}

h1 {
  margin: 0;
  background-color: #ff5777;
  color: #fff;
}
```

然后在`src/index.js`里面引入css样式内容。

```js
import './styles/index.css';

// 测试内容
console.log(1);
```

此时，我们`npm run dev`肯定会出现问题。

```
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. 
```

所以，我们需要为CSS添加相应的loader。

```shell
npm i css-loader style-loader -D
```

`config/webpack.dev.js`

```js
const config = {
    // ...
	module: [
        {
          test: /\.css$/,
          use: [
            {
              // 将css写入到html里面
              loader: 'style-loader'
            },
            {
              // 将样式放到main.bundle.js里面
              loader: 'css-loader'
            }
          ]
        }
	],
    // ...
}
```

此时，运行`npm run dev`就可以在页面上看到相应的效果了。

#### sass/less/stylus支持

为了支持sass/less/stylus，我们还需要添加相应的loader。当然，这个看具体需求，需要哪种就添加哪一种即可。

```shell
npm i -D node-sass sass-loader
npm i -D less less-loader
npm i -D stylus stylus-loader
```

在`config/webpack.dev.js`里面作如下的配置

```js
const config = {
    module: {
		rules: [
           // ...
          // sass/scss
          {
            test: /\.(sass|scss)$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
          },
          // less
          {
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'less-loader']
          },
          // stylus
          {
            test: /\.styl$/,
            use: ['style-loader', 'css-loader', 'stylus-loader']
          },
        ]
    }
}
```

修改`dist/index.html`的内容

```html
  <h1>Hello webpack</h1>
  <div class="sass">Sass样式</div>
  <div class="less">less样式</div>
  <div class="stylus">stylus样式</div>
  <script type="text/javascript" src="./main-bundle.js"></script>
```

创建相应的样式文件：

`src/styles/sass.sass`

```scss
$color: #abc
$height: 100px
.sass
  width: 100px
  height: $height
  background-color: $color
  text-align: center
  line-height: $height
```

`src/styles/scss.scss`

```scss
$fontSize: 50px;
.sass {
  font-size: 14px;
  color: #fff;
}
```

`src/styles/less.less`

```less
@height: 100px;
.less {
  width: 100px;
  height: @height;
  background-color: #f40;
  line-height: @height;
  font-size: 16px;
  color: #fff;
}
```

`src/styles/stylus.styl`

```stylus
@height: 50px

.stylus
  width: 200px
  height: @height
  background-color: #f4ccf4
  line-height: @height
  font-size: 16px
  text-align: right
```

然后在`src/index.js`里面引入相应的文件

```js
import './styles/index.css';
import './styles/sass.sass';
import './styles/scss.scss';
import './styles/less.less';
import './styles/stylus.styl';

// 测试内容
console.log(1);
```

再重新运行`npm run dev`就可以在页面看到相应的效果了！

#### 添加浏览器厂商前缀

安装相应的依赖

```shell
npm i -D postcss postcss-loader autoprefixer
```

```js
module: [
   rules: [
      {
        test: /\.(sass|scss)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ]
]
```

然后在根目录创建`postcss.config.js`

```shell
touch postcss.config.js
```

`postcss.config.js`

```js
module.exports = {
  plugins: [require('autoprefixer')]
}
```

重新启动服务器就可以看到相应的效果了！

### 整理项目结构

在进行下一步之前，我们先把项目结构整理一下，只保留如下的文件：

```
config
	webpack.dev.js
node_modules
src
	index.js
package-lock.json
package.json
postcss.config.js
```

`src/index.js`

```js
// 测试内容
console.log(1);
```

`config/webpack.dev.js`

```js
const path = require('path');

const config = {
  // 设置当前的打包环境：development/production
  mode: 'development',
  // 设置入口
  entry: {
    main: './src/index.js'
  },

  devServer: {
    // 需要监听的目录
    contentBase: 'dist'
  },

  module: {
    rules: [
      // sass/scss
      {
        test: /\.(sass|scss)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ]
  },

  output: {
    // 输出文件的名称
    filename: '[name]-bundle.js',
    // 输出文件的路径
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  }
};

module.exports = config;
```

### 加载HTML和图片

#### HTML

添加相应的依赖

```shell
npm i -D html-loader extract-loader file-loader
```

+ html-loader：找到html文件
+ extract-loader：将html文件和bundle.js区分打包
+ file-loader：将html文件起名

`config/webpack.dev.js`

```js
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].html'
            }
          },
          {
            loader: 'extract-loader'
          },
          {
            loader: 'html-loader'
          }
        ]
      },
    ]
  },
```

创建`src/index.html`文件

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Hello Webpack</title>
</head>
<body>
  <div>来自src/index.html</div>
</body>
</html>
```

并且在`src/index.js`里面引入

```js
import './index.html'
```

重启服务器看效果

#### 图片

`config/webpack.dev.js`

```js
module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].html'
            }
          },
          {
            loader: 'extract-loader'
          },
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src']
            }
          }
        ]
      },
      // 图片
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name]-[hash:8].[ext]',
            }
          }
        ]
      },
    ]
}
```

设置完比后，我们需要测试一下效果是不是能达到我们的预期。

在`src`目录下新建一个`img`目录，并且拷贝相关图片(`logo.png`)到里面去。

修改`src/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Hello Webpack</title>
</head>
<body>
  <div>来自src/index.html</div>
  <div class="images">
    <img src="./img/logo.png" alt="">
  </div>
</body>
</html>
```

然后重启服务器`npm run dev`，就可以看到图片的展示效果了！

### ES6支持

安装相关依赖

+ babel-loader 加载器
+ @babel/core 核心依赖
+ @babel/polyfill 使用polyfill，自动下载相应的依赖
+ @babel/preset-env 使用环境变量
+ @babel/plugin-transform-runtime 解决环境变量的污染
+ @babel/runtime



具体如何安装相关依赖请查看：[https://www.npmjs.com/package/babel-loader](https://www.npmjs.com/package/babel-loader)

```shell
npm i -D babel-loader @babel/core @babel/polyfill @babel/preset-env @babel/plugin-transform-runtime @babel/runtime
```

`config/webpack.dev.js`

```js
module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        },
        exclude: /node_modules/,
      },
    ]
}
```

## 搭建一个简单的单页面应用脚手架

所需依赖：

```json
"@babel/core": "^7.6.4",
"@babel/plugin-transform-runtime": "^7.6.2",
"@babel/polyfill": "^7.6.0",
"@babel/preset-env": "^7.6.3",
"@babel/runtime": "^7.6.3",
"autoprefixer": "^9.7.0",
"babel-loader": "^8.0.6",
"clean-webpack-plugin": "^3.0.0",
"copy-webpack-plugin": "^5.0.4",
"css-loader": "^3.2.0",
"file-loader": "^4.2.0",
"html-loader": "^0.5.5",
"html-webpack-plugin": "^3.2.0",
"node-sass": "^4.13.0",
"postcss-loader": "^3.0.0",
"sass-loader": "^8.0.0",
"style-loader": "^1.0.0",
"url-loader": "^2.2.0",
"webpack": "^4.41.2",
"webpack-cli": "^3.3.9",
"webpack-dev-server": "^3.9.0"
```

项目目录：

```
config
	webpack.dev.js
public
	img
src
	index.js
index.html
package-lock.json
package.json
postcss.config.js
```

`webpack.dev.js`

```js
const path = require('path'),
      HTMLWebpackPlugin = require('html-webpack-plugin'),
      // 用于复制静态文件
      CopyWebpackPlugin = require('copy-webpack-plugin'),
      // 清除dist目录
      { CleanWebpackPlugin } = require('clean-webpack-plugin');


const devConfig = {

  mode: 'development',

  entry: './src/index.js',

  devServer: {
    contentBase: 'dist',
    hot: true,
    overlay: true
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime']
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: ['img:src']
          }
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('public', 'img/[name].[hash:8].[ext]')
        }
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(), // 这里不需要传递参数，它清除的正好是output里面设置的出口
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      minify: {
        // removeComments: true, // 去除注释
        // collapseWhitespace: true, // 去除空白
      }
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../public/img'),
        to: path.resolve(__dirname, '../dist', 'img')
      }
    ])
  ],

  output: {
    filename: '[name]-[hash:8].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  }

};

module.exports = devConfig;
```

