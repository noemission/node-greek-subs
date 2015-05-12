var $ = require('cheerio'),
    request = require('request'),
    fs = require('fs'),
    unzip = require('unzip');

function searchSub(name, cb) {
    if (!name) return cb(new Error('didnt find anything'));
    console.log("Searching for: " + name);
    console.log("....");
    request('http://www.movies-watch.org/search.php?name=' + name,
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var urls = [];
                $.load(body)('html')
                    .find('a[onclick="runme()"]')
                    .each(function() {
                        urls.push($(this).attr('href'))
                    })
                if (urls.length > 0) {
                    function dlSub(index) {
                        if (index >= urls.length) return cb(new Error("Nothing found"));
                        downloadSub(urls[index], function(data) {
                            return (data instanceof Error ||
                                    (data instanceof Array && data.length == 0)) ?
                                dlSub(++index) :
                                cb(data);
                        })
                    }
                    dlSub(0);
                } else {
                    searchSub(name.slice(0, name.lastIndexOf(" ")), cb);
                }


            } else {
                searchSub(name.slice(0, name.lastIndexOf(" ")), cb);
            }
        })
}

function downloadSub(link, cb) {
    var results = [];
    try {
        var id = link.match(/\?id=(.*)/)[1];
    } catch (e) {
        return false;
    }
    console.log('downloading>>>', "http://www.findsubtitles.eu/getp.php?id=" + id)
    var stream = request("http://www.findsubtitles.eu/getp.php?id=" + id);
    stream.on('error', function() {
        console.error('oops!')
    })
    unzipFunc(stream, cb);



}


function unzipFunc(stream, results, cb) {
    if (typeof results == "function") {
        cb = results;
        results = []
    }

    unzip_stream = stream.pipe(unzip.Parse());
    unzip_stream.on('error', function(err) {
        cb(err);
    })
    unzip_stream.on('readable', function() {});
    unzip_stream.on('entry', function(entry) {
        var fileName = entry.path;
        var name = fileName.slice(fileName.lastIndexOf("/") + 1);
        if (fileName.indexOf('.srt') != -1) {
            results.push(name);
            entry.pipe(fs.createWriteStream(name));
        } else if (fileName.indexOf('.zip') != -1 && results.indexOf(name) == -1) {
            results.push(name);
            unzipFunc(entry, results)
        } else {
            entry.autodrain();
        }
    })
    unzip_stream.on('end', function() {
        cb ? cb(results) : null;
    })
}

function humanize_string(property) {
    property = property.slice(property.lastIndexOf('=') + 1);
    return property.slice(property.lastIndexOf('/') + 1)
        .replace(/_|\./g, ' ')
        .replace(/(\w+)/g, function(match) {
            return match.charAt(0).toUpperCase() + match.slice(1);
        })
        .replace(/\s{2,}/g, ' ');
};
module.exports = function(fileName, callback) {
    searchSub(humanize_string(fileName), callback);
};