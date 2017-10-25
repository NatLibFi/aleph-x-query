# A module for querying records from Aleph X-service

## Installation

```
npm install aleph-x-query
```

## Usage

To query an index (op=find):

```
AlephXServices = require('aleph-x-query');

var aleph = new AlephXServices({
	Xendpoint: 'http://my-aleph-installation/X' 
});

// The parameters are: base, index, and query term.
var base = 'fin11';
var index = 'WNA';
var searchTerm = 'Virtanen';

aleph.query(base, index, searchTerm).then(function(records) {
	// do something with records. The records are instances of marc-record-js 

}).catch(function(e) {
	// handle errors
}).done();

```
## License and copyright

Copyright (c) 2015-2017 University Of Helsinki (The National Library Of Finland)

This project's source code is licensed under the terms of **GNU Lesser General Public License Version 3**  or any later version.