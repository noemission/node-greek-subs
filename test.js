var $ = require('cheerio'),
    request = require('request'),
    fs = require('fs'),
    unzip = require('unzip');

var request = request.defaults({
    jar: true
})
var options = {
    url: 'http://www.small-industry.com/download-s14a133cafe.html',
    headers: {
        "Host": "www.small-industry.com",
        "Referer": "http://www.small-industry.com/search_report.php?search=big+hero&searchType=1",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36"
    }
};
request(options,
    function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(response)
            var urls = [];
            var a = $.load(body)('html')
                .find('tr [valign="middle"] a')
                .attr('href')

            console.log('aaa', a);
            next(a);

        } else {
            console.log('eee' + error)
        }
    })

function next(url) {
    var options = {
        url: 'http://www.small-industry.com/' + url,
        headers: {
            "Host": "www.small-industry.com",
            "Referer": "http://www.small-industry.com/download-s14a133cafe.html",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36"
        }
    };
    console.log(options.url)
    request(options).pipe(fs.createWriteStream('sdsd'));
}