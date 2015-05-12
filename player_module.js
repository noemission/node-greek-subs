var spawn = require('child_process').spawn,
    child;



module.exports = function(file_name, subtitle, next) {
    child = spawn("vlc", [file_name, '--play-and-exit', '--fullscreen', '--sub-file', subtitle]);
    child.on('exit', next);
}