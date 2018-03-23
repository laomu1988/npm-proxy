/**
 * 修改返回结果
 */
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')

module.exports = function(config) {
    if (config.timeout > 0) {
        let last = Date.now()
        let timefile = path.join(config.saveTo, '/cleartime.txt')
        if (fs.existsSync(timefile)) {
            last = parseInt(fs.readFileSync(timefile, 'utf8'), 10)
        }
        if (config.timeout < 60) {
            config.timeout = 60
        }
        setTimeout(function() {
            clearFile(config)
        }, (config.timeout + Date.now() - last) * 1000)
    }
}

function clearFile(config) {
    console.log('clear cache...')
    rimraf(path.join(config.saveTo, '/proxy-projects'), function(err) {
        if (err) {
            console.error('clearFileError', err)
        }
        rimraf(path.join(config.saveTo, '/tgz'), function(err) {
            if (err) {
                console.error('clearFileError', err)
            }
            fs.writeFileSync(path.join(config.saveTo, 'cleartime.txt'), Date.now())
            setTimeout(function() {
                clearFile(config)
            }, config.timeout * 1000)
        })
    })
}