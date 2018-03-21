const express = require('express');
const path = require('path')
const app = new express();
const request = require('./middleware/request');
const changeHost = require('./util/changeTarget');
const writeFile = require('./util/writeFile');

const defaultConfig = {
    registry: 'registry.npm.baidu.com',
    localhost: 'localhost:8222',
    saveTo:  path.join(__dirname, '../cache')
}

module.exports = function(options) {
    const config = Object.assign({}, defaultConfig, options)

    const pipe = request({host: config.registry});
    app.use(function(req, res, next) {
        console.log('url:', req.method, req.url);
        next();
    });
    app.use(express.static(config.saveTo))
    app.use(express.static(config.saveTo + '/proxy-projects'))
    app.use(express.static(config.saveTo + '/tgz'))

    app.use(function(req, res, next) {
        if(req.url.indexOf('.tgz') < 0) {
            pipe(req, res, function() {
                let contentType = res.headers['content-type'];
                res.append('content-type', contentType)
                if (contentType.indexOf('json') >= 0) {
                    res.body = changeHost(res.body, config.localhost);
                    writeFile(config.saveTo + '/proxy-projects' + req.url, res.body, 'utf8');
                }
                res.send(res.body);
            })
        }
        else {
            pipe(req, res, function() {
                res.append('content-type', res.headers['content-type'])
                res.send(res.body);
                writeFile(config.saveTo + '/tgz' + req.url, res.body, 'utf8');
            })
        }
    })

    app.use(function(err, req, res, next) {
        if (err) {
            console.error(err);
        }
        res.send('Not Found.');
    })

    // 监听端口
    app.listen(config.port, function(err) {
        if (err) {
            console.error(err);
        }
        else {
            console.log('start server at http://localhost:' + config.port);
        }
    });
}

//  npm install --registry=http://pnpm.baidu.com
