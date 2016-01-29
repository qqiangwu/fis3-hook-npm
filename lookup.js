function _find(name, path) {
    var info = fis.uri(name, path);

    if (!info.file) {
        info = fis.uri(name + '.js', path);
    }

    return info;
}

function _lookupModule(cname, opts) {
    var moduleJson = [fis.project.getProjectPath(), opts.base, cname, 'package.json'].join('/');

    try {
        var pkgInfo = require(moduleJson);
        var main = pkgInfo.main;
        return _find([opts.base, cname, main].join('/'), fis.project.getProjectPath());
    } catch (e) {
        fis.log.debug('[Lookup Module] invalid package', e);
    }
}

function _lookupSubModule(path, opts) {
    return _find([opts.base, path].join('/'), fis.project.getProjectPath());
}

module.exports = function(info, file, opts) {
    // ignore processed files
    if (info.file) {
        return;
    }

    var m = /^([0-9a-zA-Z\.\-_]+)(?:\/(.+))?$/.exec(info.rest);
    if (m) {
        var cname = m[1];
        var subpath = m[2];
        var resolved;

        if (!subpath) {
            resolved = _lookupModule(cname, opts);
        } else {
            resolved = _lookupSubModule(info.rest, opts);
        }

        if (resolved && resolved.file) {
            info.id = info.moduleId = info.rest;
            info.file = resolved.file;

            fis.match(info.file.getId(), {
                id: info.rest,
                moduleId: info.rest,
                isMod: true,
                isNode: true
            });
        }
    }
};
