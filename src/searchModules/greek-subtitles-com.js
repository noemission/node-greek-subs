const $ = require('cheerio');
const download = require('../common/download')

module.exports = {
    name: 'www.greek-subtitles.com',
    collector: async (name) => {
        let data = [];
        const response = await download('http://www.greek-subtitles.com/search.php?name=' + name, {
            requestOptions: { timeout: 8000 },
            retry: true,
            maxRetries: 3
        })
        $.load(response.toString())('html')
            .find('a[onclick="runme()"]')
            .each(function () {
                data.push({
                    url: $(this).attr('href'),
                    text: $(this).text()
                })
            })
        return data;
    },
    download: (url) => {
        const id = url.match(/\?id=(.*)/)[1];
        return download("http://www.greeksubtitles.info/getp.php?id=" + id, {
            retry: true
        })
    }
}