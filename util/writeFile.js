const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');

module.exports = function saveTo(saveTo, body, options) {
    saveTo = path.resolve(saveTo);
    let dir = path.dirname(saveTo);
    try {
        mkdirp.sync(dir)
        fs.writeFileSync(saveTo, body, options)
    }
    catch(err) {
        console.error('SaveFileError:' + saveTo, err)
    }
}