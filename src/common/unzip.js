const { promisify } = require('util')
const yauzl = require('yauzl')
const fromBuffer = promisify(yauzl.fromBuffer);
const fs = require('fs')
const path = require('path')

const isASubtitle = (fileName) => /\.srt$/.test(fileName)

const unzip = async (zipBuffer) => {

    const zipFile = await fromBuffer(zipBuffer),
        subtitleProms = [];

    zipFile.on("entry", entry => {
        if (isASubtitle(entry.fileName)) {
            const unzipPromise = new Promise((resolve, reject) => {
                zipFile.openReadStream(entry, (err, readStream) => {
                    if (err) return reject(err);

                    const writeStream = fs.createWriteStream(path.basename(entry.fileName));
                    readStream.pipe(writeStream)
                    writeStream.on('close', () => {
                        resolve(path.resolve(writeStream.path))
                    })
                })
            })
            subtitleProms.push(unzipPromise);
        }
    })

    await new Promise(resolve => zipFile.on("end", resolve));

    return await Promise.all(subtitleProms)

}

module.exports = unzip;