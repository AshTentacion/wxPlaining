# wxPlaining
微信小程序 mpvue+vant-weapp+echarts

#项目截图
![首页](https://github.com/AshTentacion/wxPlaining/blob/main/pic1.PNG)
![详情页](https://github.com/AshTentacion/wxPlaining/blob/main/pic2.PNG)

安装依赖
yarn 或者 npm install

开发时构建
yarn dev 或者 npm dev

然后用微信开发者工具打开项目

打包构建
npm build

指定平台的开发时构建(微信、百度、头条、支付宝)
npm dev:wx npm dev:swan npm dev:tt npm dev:my

指定平台的打包构建
npm build:wx npm build:swan npm build:tt npm build:my

生成 bundle 分析报告
npm run build --report
