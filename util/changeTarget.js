/**
 * 修改tgz地址
 */
const Url = require('url');
function replaceHost(url, host) {
    let p = Url.parse(url);
    return p.protocol + '//' + host + p.path;
}

module.exports = function updateHost(body, host) {
    body = JSON.parse(body);
    for(let attr in body.versions) {
        let version = body.versions[attr];
        if (version.dist && version.dist.tarball) {
            version.dist.tarball = replaceHost(version.dist.tarball, host);
        }
    }
    return JSON.stringify(body);
}
