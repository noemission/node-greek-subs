var searchSub = require('./subtitle_module.js'),
    fs = require('fs'),
    player = require('./player_module.js');

var toCleanUp = [];

console.time('Execution time');
process.on('exit', function() {
    console.timeEnd('Execution time');
    console.log('cleaning up....', toCleanUp);
    toCleanUp.forEach(fs.unlinkSync)
})
if (process.argv.length < 3) {
    console.error('Give something to do!');
    process.exit();
}
var file_names = process.argv.slice(2),
    index = 0;

(function play() {
    var file_name = file_names[index++];
    if (!file_name) return;
    searchSub(file_name, function onSubFound(results) {
        var subtitle;
        if (results instanceof Error) {
            console.error("ERROR::", results.message);
            subtitle = "";
        } else {
            console.log('Vrika::', results.toString());
            toCleanUp = toCleanUp.concat(results);
            subtitle = results[0];
        }
        player(file_name, subtitle, play);
    })
})();