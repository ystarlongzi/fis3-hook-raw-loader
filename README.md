fis3-hook-raw-loader
====================

一款基于 fis3 的 raw loader，允许在类 js 文件中嵌入其它文件的内容。


### 安装
```
npm install fis3-hook-raw-loader
```


### 配置
```
fis.hook('raw-loader');
```


### 用法
```
-- page
  -- item.less
  -- item.es6
  -- item.png
  -- list.es6
```
假设存在如上目录结构，其中 `item.less` 内容如下：
```less
.title {
  font-size: 16px;

  strong {
    color: red;
  }
}
```
`item.es6` 内容如下：
```javascript6
const word = 'Hello world!';
```

然后，我们在 `list.es6` 中可以使用以下两种方法嵌入文件内容：
- 使用 `import` 或 `require` 关键字。（其中 `!raw!` 表示的是获取文件最初的、未做任何处理的内容）

```
// list.es6
import js from 'raw!./item';
import css from '!raw!./item.less';
const img = require('raw!./item.png');
```


- 使用 `__fis__raw()` 方法。（`!!` 和 `!raw!` 表示相同的含义）
```
// list.es6
const js = __fis__raw('!./item');
const css = __fis__raw('!!./item.lss');
const img = __fis__raw('!./item.png');
```


上面两种方式编译后的内容大致如下：
```
// list.es6
var js = "var word = 'Hello world!';";
var css = ".title {\n  font-size: 16px;\n\n  strong {\n    color: red;\n  }\n}";
var img = "data:image/png;base64,iVBORw0K......AAAElFTkSuQmCC";
```

