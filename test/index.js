const assert = require('assert');
const fs = require('fs');
const NodeGreekSubs = require('../src/main');

function test1() {
    const greekSubs = new NodeGreekSubs('Spiderman 1 2002 1080p x264.mkv')

    greekSubs.on('search::start', data => {
        try {
            assert.ok(
                [
                    'Spiderman 1 2002 1080p X264 Mkv',
                    'Spiderman 1 2002 1080p X264'
                ].some(q => data.query === q),
                `"${data.query}" is not a valid query`
            )

            assert.equal(data.searchModule, 'www.greek-subtitles.com')
        } catch (error) {
            console.log(data)
            console.error(error)
            process.exit(1)
        }
    })
    greekSubs.on('search::finish', data => {
        try {
            assert.equal(data.searchModule, 'www.greek-subtitles.com')
            data.query === 'Spiderman 1 2002 1080p X264' && assert.ok(data.results.length > 0, 'Search returned no results')
        } catch (error) {
            console.log(data)
            console.error(error)
            process.exit(1)
        }
    })
    return greekSubs.search()
}

function test2() {
    const greekSubs = new NodeGreekSubs('538b53a0')

    greekSubs.on('search::finish', data => {
        try {
            assert.equal(data.searchModule, 'www.greek-subtitles.com')
            assert.ok(data.results.length === 0, 'Search should returned no results')
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    })
    return greekSubs.search()
}

function test3() {
    const greekSubs = new NodeGreekSubs('Spiderman 1 2002 1080p x264.mkv')

    greekSubs.on('download::start', data => {
        try {
            assert.equal(data.searchModule, 'www.greek-subtitles.com')
            assert.ok(data.url.length > 0, 'Download should have a url')
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    })
    greekSubs.on('download::finish', data => {
        try {
            assert.equal(data.searchModule, 'www.greek-subtitles.com')
            assert.ok(Buffer.isBuffer(data.result) && data.result.length > 0, 'Download should return a non-empty buffer')
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    })
    return greekSubs.search().then(subs => {
        try {
            assert.ok(Array.isArray(subs) && subs.length > 0, 'It should return a non-empty array')
            assert.ok(subs.every(sub => fs.existsSync(sub) ), 'It should be an array with proper paths')
            return subs
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    })
}


test1().then(test2).then(test3)
    .then(files => files.forEach(fs.unlinkSync))