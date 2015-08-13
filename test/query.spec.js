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