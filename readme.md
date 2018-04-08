# npm包缓存服务器

简单的npm缓存服务，第一次请求的包会缓存到本地文件，后续再次请求时就直接使用本地服务。
无需数据库，直接使用本地静态资源作为服务器

## 安装
```
npm install @laomu/npm-proxy
```

## 使用

1. 首先创建js文件,例如proxy.js
```
const proxy = require('@laomu/npm-proxy');
proxy({
    registry: 'registry.npm.baidu.com', // 转发到的npm服务地址
    port: 8221,                         // 本地监听端口
    timeout: 30000,                     // 缓存超时时间，定期对数据进行清理,单位秒，默认2天
    localhost: 'proxy.server.host:8221',// 远程加载时请求的服务器地址
    saveTo: __dirname + '/cache'        // 缓存文件保存目录
})
```
2. 启动proxy.js
```
node proxy.js
# 或者
pm2 start proxy.js
```
3. 如何使用缓存服务
```
npm install --registry=http://proxy.server.host:8221
```

## 如何工作
请求npm包信息时，转发请求前将包信息中的tgz地址更换为服务器地址，之后请求tgz包内容时会请求服务器地址
在请求转发后，将转发内容存储到服务器，下次请求相同文件时将直接使用本地文件而达到加速效果

## 版本记录
* v1.0.4
    - 增加upload配置项，可上传文件，默认关闭
* v1.0.3
    - 增加timeout参数，配置缓存过期时间
* v1.0.2
    - 基本缓存功能