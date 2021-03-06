var expect = require('chai').expect;
var path = require('path');
var self = require('../');
var fis = require('fis3');
var _ = fis.util;

function hookSelf(opts) {
    self(fis, opts || {});
}

describe('fis3-hook-npm-lookup', function() {
    beforeEach(function () {
        fis.project.setProjectRoot(__dirname);
        fis.media().init();
        fis.config.init();
        fis.compile.setup();
        fis.cache.enable = false;

        hookSelf();
    });

    it('index-lookup', function() {
        var p = fis.project.lookup('js-tokens');

        expect(p).to.have.property('file');
        expect(p.id).to.be.equal('node_modules/js-tokens/index.js');
    });

    it('module-lookup', function() {
        var p = fis.project.lookup('warning');

        expect(p).to.have.property('file');
        expect(p.id).to.be.equal('node_modules/warning/browser.js');
    });

    it('submodule-lookup', function() {
        var p = fis.project.lookup('react-dom/dist/react-dom');

        expect(p).to.have.property('file');
        expect(p.id).to.be.equal('node_modules/react-dom/dist/react-dom.js');
    });

    it('css-lookup', function() {
        var p = fis.project.lookup('css/x.css');

        expect(p).to.have.property('file');
        expect(p.id).to.be.equal('node_modules/css/x.css');
    });

    it('submodule-index-lookup', function() {
        var p = fis.project.lookup('subx/sub');

        expect(p).to.have.property('file');
        expect(p.id).to.be.equal('node_modules/subx/sub/index.js');
    });
});

describe('fis3-hook-npm-shim', function() {
    beforeEach(function () {
        fis.project.setProjectRoot(__dirname);
        fis.media().init();
        fis.config.init();
        fis.compile.setup();
        fis.cache.enable = false;

        hookSelf({
            shim: {
                'angular-markdown-directive': {
                    deps: {
                        'angular': 'angular',
                        // we don't need the symbol
                        'angular-sanitize': null,
                        'showdown': 'Showdown'
                    },
                    exports: '"btford.markdown"'
                }
            }
        });
    });

    it('shim', function() {
        var info = fis.project.lookup('angular-markdown-directive');
        var file = fis.file(info.file.realpath);

        var c = fis.compile(file);

        expect(c).to.have.property('nodeId');
        expect(c.getContent()).to.contain('var angular = require("angular")');
        expect(c.getContent()).to.contain('require("angular-sanitize")');
        expect(c.getContent()).to.contain('var Showdown = require("showdown")');
        expect(c.getContent()).to.contain('module.exports = "btford.markdown"');
    });
});


describe('fis3-hook-npm-browserfiy', function() {
    beforeEach(function () {
        fis.project.setProjectRoot(__dirname);
        fis.media().init();
        fis.config.init();
        fis.compile.setup();
        fis.cache.enable = false;

        hookSelf();
    });

    it('dev', function() {
        var info = fis.project.lookup('env/index');
        var file = fis.file(info.file.realpath);

        var c = fis.compile(file);
        var content = c.getContent();

        expect(content).to.contain('x: "development"');
        expect(content).to.contain('y: "development"');
    });

    it('prod', function () {
        var info = fis.project.lookup('env/index2');
        var file = fis.file(info.file.realpath);

        file.optimizer = true;

        var c = fis.compile(file);
        var content = c.getContent();

        expect(content).to.contain('x: "production"');
        expect(content).to.contain('y: "production"');
    });
});
