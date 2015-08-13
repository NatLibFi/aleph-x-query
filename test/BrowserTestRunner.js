require.config({
	baseUrl: "../",
    paths: {
      'chai': 'node_modules/chai/chai',
      'q': 'node_modules/q/q',
      'axios': 'node_modules/axios/dist/axios.amd',
      'jxon': 'node_modules/jxon/index'
    }
});

require([
	'q',
	"query.spec.js",
], function(Q) {
	"use strict";

	Q.longStackSupport = true;
	Q.onerror = function(err) {
		console.error(err.stack);
	};

	if (window.mochaPhantomJS) { 
		window.mochaPhantomJS.run(); 
	} else { 
		window.mocha.run(); 
	}

});