const express = require('express')
const app = new express()
const request = require('./middleware/request')
const changeHost = require('./util/changeTarget')
const writeFile = require('./util/writeFile')
const clearCache = require('./util/clearCache')

const defaultConfig = {
    registry: 'registry.npm.baidu.com', // 转发到的npm服务地址
    port: 8221,                         // 本地监听端口
    timeout: 48 * 60 * 60,              // 缓存超时时间，定期对数据进行清理,单位秒, 默认2天
    localhost: 'proxy.server.host:8221',// 远程加载时请求的服务器地址
    saveTo: __dirname + '/cache'        // 缓存文件保存目录
}

module.exports = function(options) {
    const config = Object.assign({}, defaultConfig, options)

    const pipe = request({host: config.registry})
    app.use(function(req, res, next) {
        console.log('url:', req.method, req.url)
        next()
    })
    app.use(express.static(config.saveTo))
    app.use(express.static(config.saveTo + '/proxy-projects'))
    app.use(express.static(config.saveTo + '/tgz'))

    app.use(function(req, res, next) {
        if(req.url.indexOf('.tgz') < 0) {
            pipe(req, res, function() {
                if (res.error) {
                    res.status(500)
                    res.send(res.error)
                    return
                }
                if (!res.headers ) {
                    res.status(404)
                    res.send('NOT FOUND')
                    return
                }
                let contentType = res.headers['content-type']
                res.append('content-type', contentType)
                if (contentType.indexOf('json') >= 0) {
                    res.body = changeHost(res.body, config.localhost)
                    writeFile(config.saveTo + '/proxy-projects' + req.url, res.body, 'utf8')
                }
                res.send(res.body)
            })
        }
        else {
            pipe(req, res, function() {
                res.append('content-type', res.headers['content-type'])
                res.send(res.body)
                writeFile(config.saveTo + '/tgz' + req.url, res.body, 'utf8')
            })
        }
    })

    app.use(function(err, req, res, next) {
        if (err) {
            console.error(err)
        }
        res.send('Not Found.')
    })

    // 监听端口
    app.listen(config.port, function(err) {
        if (err) {
            console.error('ListenError:', err)
        }
        else {
            clearCache(config)
            console.log('start server at http://localhost:' + config.port)
        }
    })
}

//  npm install --registry=http://pnpm.baidu.com
