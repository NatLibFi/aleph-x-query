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
 /*jshint mocha: true*/

(function(root, testrunner) {
	"use strict";
	if (typeof define === 'function' && define.amd) {
		define(['chai', 'lib/query'], testrunner);
	} else if(typeof exports === 'object') {
		testrunner(require('chai'), require('../lib/query'));  // jshint ignore:line
	} else {
		testrunner(root.chai, root.AlephXServices);
	}
}(this, function(chai, AlephXServices) {
	"use strict";
	var expect = chai.expect;

	var asteri = new AlephXServices({
		Xendpoint: 'http://localhost:8080/melinda.kansalliskirjasto.fi/X' 
	});

	describe('asteri name query', function(done) {

		it('should find more than 300 Virtanens from asteri in less than 5 seconds', function(done) {
			this.timeout(5000);
			asteri.query('fin11', 'WNA', 'Virtanen').then(function(records) {
			
				expect(records).to.have.length.above(300);
				
				done();
			}).catch(function(e) {
				console.log(e.stack);
			});
		});

		it('should find only one: "Kivi, Aleksis, 1834-1872"', function(done) {
			
			asteri.query('fin11', 'WNA', 'Kivi, Aleksis, 1834-1872').then(function(records) {

				var names = records.map(toName);
			
				expect(records).to.have.length(1);
				expect(names[0]).to.equal('Kivi, Aleksis, 1834-1872');
				done();

			}).catch(function(e) {
				console.log(e.stack);
			});
		});

	});

	function toName(record) {

		var nameFields = record.fields.filter(byTags(['100','110','111']));
		var names = nameFields.map(function(field) {
			return field.subfields.map(function(sub) {
				return sub.value;
			}).join(' ');
		});
		if (names.length > 1) {
			throw new Error("Record has multiple names: " + nameFields.join());
		}
		return names[0];

	}

	function byTags(tagArray) {
		return function(field) {
			return (tagArray.indexOf(field.tag)) !== -1;
		};
	}

}));