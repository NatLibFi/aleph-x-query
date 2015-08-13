"use strict";

var cors_proxy = require('cors-anywhere');
var server = cors_proxy.createServer({
    //requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
});

module.exports = server;