<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/FengZi-lv/GenShinWishAnalysis">
    <img src="images/logo.jpg" alt="Logo" width="80" height="80">
  </a>
<h3 align="center">GenShinWishAnalysis 原神祈愿记录分析</h3>

<p align="center">
A JavaScript class library suitable for the analysis of GenShin's wish records

<br/>
适用与原神祈愿记录分析的JavaScript类库
  </p>

</p>





<!-- ABOUT THE PROJECT -->

## 关于这个项目

此类库适用与 `NodeJS`和`React Native`

已在`React Native`中通过测试, `NodeJS`未测试

Such libraries are suitable for `NodeJS` and `React Native`

Tested in `React Native`, `NodeJS` not tested

<!-- GETTING STARTED -->

## 开始

要启动并运行本地副本，请遵循这些简单的示例步骤。

To get a local copy up and running follow these simple example steps.

## 安装

### 对于 React Native

复制`GenShinWishAnalysis.js`文件到你的项目


### 对于 NodeJs

1. 复制`GenShinWishAnalysis.js`文件到你的项目

2. 安装`node-fetch`
	```shell
	npm install node-fetch
	```
3. 在`GenShinWishAnalysis.js`的开头加上
	```javascript
	import fetch from 'node-fetch';
	```


<!-- USAGE EXAMPLES -->

## 使用方法

关于函数的作用, 请查看`GenShinWishAnalysis.js`文件中的注释

For the role of the function, please see the comments in the `GenShinWishAnalysis.js` file

例子:
```javascript
const url = " https://webstatic.mihoyo.com/hk4e/event/e20190909gacha-v2/index.html?xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

const GSWA = new GenShinWishAnalysis(url);
GSWA.getLog(GSWA.type[0]).then(res => {
	GSWA.analysisData(res).then(res => {
		console.log(res);
	});
});
```

返回:
```javascript
{
    total: 235,
    rank_total: {3: 202, 4: 30, 5: 3},
    rank5_count: [
		{name: "纳西妲", count: 59, time: "2022-11-05 08:41:04"},
		{name: "甘雨", count: 77, time: "2022-09-11 13:41:33"},
		{name: "七七", count: 30, time: "2022-09-04 13:32:52"}
    ]
}
```

<!-- LICENSE -->

## 许可证

Distributed under the MIT License. See `LICENSE` for more information.

