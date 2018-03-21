# npm包缓存服务器

简单的npm缓存服务，第一次请求的包会缓存到本地文件，后续再次请求时就直接使用本地服务。


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
    localhost: 'proxy.server.host:8221',        // 远程加载时请求的服务器地址
    saveTo: __dirname + '/cache'        // 缓存文件保存目录
})
```
2. 启动proxy.js
```
node proxy.js
# 或者
pm2 proxy.js
```
3. 如何使用缓存服务
```
npm install --registry http://proxy.server.host:8221
```

## 其他
* 第一次请求时缓存文件会存放到cache目录下，再次请求时将直接使用本地文件而达到加速效果
* 不会自动删除文件，请避免开放机器造成占用资源过多
