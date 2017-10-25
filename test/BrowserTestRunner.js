/**
 *
 * @licstart  The following is the entire license notice for the JavaScript code in this file. 
 *
 * A module for querying records from Aleph X-service
 *
 * Copyright (c) 2015, 2017 University Of Helsinki (The National Library Of Finland)
 *
 * This file is part of aleph-x-query
 *
 * aleph-x-query is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * aleph-x-query is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.	See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this file.
 *
 **/
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