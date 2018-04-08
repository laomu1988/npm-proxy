
const proxy = require('../index')
proxy({
    registry: 'registry.npm.baidu.com',
    port: 8221,
    localhost: 'localhost:8221',
    timeout: 120,
    upload: true,
    saveTo: __dirname + '/cache'
})