process.binding('http_parser').HTTPParser = require('http-parser-js').HTTPParser;
const request = require('request')

const download = (url, options = {}) => {

    function _download(count = 1) {
        return new Promise((resolve, reject) => {
            const chunks = []
            if (count > (options.maxRetries || 5)) {
                return reject(new Error(`Tried ${count} times. Aborting.`))
            }
            request(url, options.requestOptions)
                .on('error', (err) => {
                    if (options.retry) {
                        setTimeout(() => {
                            resolve(_download(count + 1))
                        }, options.interval || 1000)
                    } else {
                        reject(err);
                    }
                })
                .on('data', (chunk) => {
                    chunks.push(chunk);
                })
                .on('complete', () => {
                    resolve(Buffer.concat(chunks))
                })
        })
    }
    return _download();
}

module.exports = download;