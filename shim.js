// add dependencies and exports

module.exports = function(info, opts) {
    var file = info.file;
    var content = info.content;
    var nodeId = file.nodeId;

    if (nodeId) {
        var shim = opts.shim && opts.shim[nodeId];

        if (shim) {
            fis.log.debug('[NPM shim]' + nodeId);

            var prefix = '';
            var postfix = '';

            if (shim.deps) {
                for (var mod in shim.deps) {
                    var symbol = shim.deps[mod];

                    if (symbol) {
                        prefix += 'var ' + symbol + ' = ';
                    }

                    prefix += 'require("{}");\n'.replace('{}', mod);
                }
            }

            if (shim.exports) {
                postfix += '\nmodule.exports = {};'.replace('{}', shim.exports);
            }

            info.content = prefix + content + postfix;
        }
    }
};
