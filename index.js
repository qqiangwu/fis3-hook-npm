var lookup = require('./lookup');
var shim = require('./shim');

module.exports = function(fis, opts) {
    var default_opts = {
        base: 'node_modules'
    };

    for (var key in default_opts) {
        if (!(key in opts)) {
            opts[key] = default_opts[key];
        }
    }

    fis.on('lookup:file', function(info, file){
        lookup(info, file, opts);
    });
    fis.on('standard:js', function(info){
        shim(info, opts);
    });
};
