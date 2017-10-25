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
 /* 

Aleph X-server query

*/

(function(root, factory) {
	"use strict";
	if (typeof define === 'function' && define.amd) {
		define([
			'axios/dist/axios.amd', 
			'jxon', 
			'q',
			'marc-record-js'
		], function(axios, jxon, q, MarcRecord) {
			return factory(axios, jxon, q, MarcRecord);
		});
	} else if(typeof exports === 'object') {
		module.exports = factory(  // jshint ignore:line
			require('axios'), 
			require('jxon'),
			require('q'),
			require('marc-record-js')
		); 
	} 
}(this, function(axios, jxon, Q, MarcRecord) {
	"use strict";

	jxon.config({
		valueKey: '$t',
		attrPrefix: '',
		autoDate: false
	});

	if (!Array.isArray) {
	  Array.isArray = function(arg) {
	    return Object.prototype.toString.call(arg) === '[object Array]';
	  };
	}

	function constructor(config) {
		if (config === undefined || config.Xendpoint === undefined) {
			throw new Error("Invalid config. Xendpoint is required");
		}

		function raw(params) {
			return axios.get(config.Xendpoint, { params: params }).then(function(axiosResponse) {
				
				axiosResponse.data = jxon.stringToJs(axiosResponse.data);
				return axiosResponse;

			});
		}

		function query(base, index, term) {
			if (index === undefined || term === undefined) {
				throw new Error("Invalid arguments");
			}
			var request = index + "=" + term;
			return xRequest(base, request);
		}

		function xRequest(base, request) {
			
			return axios.get(config.Xendpoint, {
				params: {
					'op': 'find',
					'base': base,
					'request': request
				}
			}).then(function(response) {

				var results = jxon.stringToJs(response.data);
				
		 		var from = 1;
		 		var to = results.find.no_records;

		 		return loadRecords(results.find.set_number, from, to);

		 	});

		}

		function loadRecords(set_number, from, to) {

			var records = [];
			var loadRecordsDeferred = Q.defer();
			var deferred = Q.defer();

			loadPage(from, to);

			deferred.promise.then(function() {
				records = records.map(parseOAIRecord);
				loadRecordsDeferred.resolve(records);
			}).done();

			return loadRecordsDeferred.promise;

			function loadPage(from, to) {
				
				axios.get(config.Xendpoint, {
					params: {
						'op': 'present',
						'set_no': set_number,
						'set_entry': from + '-' + to
					}
				}).then(function(response) {
					
					var res = jxon.stringToJs(response.data);
					
					if (res.present.record === undefined) {
						res.present.record = [];
					}
					if (!Array.isArray(res.present.record)) {
						res.present.record = [res.present.record];
					}

					records = records.concat(res.present.record.map(function(responseEntry) {
						return responseEntry.metadata.oai_marc;
					}));

					if (morePagesAvailable(res)) {
						loadPage(lastPageEntry(res)+1, to);
					} else {
						deferred.resolve();
					}

					function morePagesAvailable(res) {
						return parseInt(lastPageEntry(res)) < parseInt(to);
					}
					function lastPageEntry(res) {
						if (res.present.record[res.present.record.length-1] !== undefined) {
							return res.present.record[res.present.record.length-1].record_header.set_entry;
						}
						return 0;
					}

				}).catch(function(error) {
					deferred.reject(error);
				});

			}

		}

		return {
			query: query,
			xRequest: xRequest,
			raw: raw
		};
	}

	function parseOAIRecord(OAI_record) {
	
		var record = {
			leader: '',
			fields: []
		};
		
		OAI_record.fixfield.forEach(function(field) {
			if (field.id === 'LDR') {
				record.leader = field.$t;
			} else {
				record.fields.push({
					tag: lpad(field.id),
					value: field.$t
				});
			}
		});

		OAI_record.varfield.forEach(function(field) {
			
			record.fields.push({
				tag: lpad(field.id),
				ind1: field.i1,
				ind2: field.i2,
				subfields: subfields()
			});
		
			function subfields() {
				if (!Array.isArray(field.subfield)) {
					field.subfield = [field.subfield];
				}

				return field.subfield.map(function(oai_subfield) {
					
					return {
						code: oai_subfield.label,
						value: oai_subfield.$t
					};
				});
			}
		});

		return new MarcRecord(record);

		function lpad(str, len, char) {
			len = len || 3;
			char = char || '0';
			str = str.toString();
			while (str.length < len) {
				str = char + str;
			}
			return str;
		}
	}

	return constructor;

}));
