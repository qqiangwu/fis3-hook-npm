// replace node specific variables

module.exports = function(info, opts) {
    if (info.file.isJsLike) {
        var content = info.content;
        var isProd = info.file.optimizer;

        info.content = content.replace(/process.env.NODE_ENV/g, isProd? '"production"': '"development"');
    }
};
