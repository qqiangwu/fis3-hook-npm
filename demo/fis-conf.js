fis.set('project.files', ['/views/**', '/modules/**', 'map.json']);

fis.hook('npm', {
    shim: {
        'angular-ui-router': {
            deps: {
                'angular': 'angular'
            }
        }
    }
});

fis.hook('commonjs');

fis.match('/node_modules/fis-mod/mod.js', {
    wrap: false
});

fis.match('/node_modules/**.js', {
    isMod: true
});

// DO NOT DO THIS! DO NOT EVER EXPLICITLY MENTION /node_modules
//fis.match('/node_modules/(**).js', {
//    id: '$1'
//});

fis.match('/views/(**)', {
    release: '$1'
});

fis.match('::package', {
    postpackager: [
        fis.plugin('loader'),
        fis.plugin('inline')
    ],
    packager: fis.plugin('map', {
        useTrack: false
    })
});
