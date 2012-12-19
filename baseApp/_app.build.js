({ 
    appDir        : '.',
    baseUrl       : '.',
    // output directory relative to this file
    dir           : '../baseAppBuild',
    // optimize config
    optimize      : 'uglify',
    optimizeCss   : 'standard.keepLines',
    // imclude all paths
    mainConfigFile: 'core/init.js',
    // inline text! html file
    inlineText    : true,
    // include entry point "init"
    modules       : [{ name: 'init' }]
})
