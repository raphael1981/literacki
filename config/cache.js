var CachemanFile = require('cacheman-file');
var cache = new CachemanFile({tmpDir:'tmp'});

module.exports = cache;