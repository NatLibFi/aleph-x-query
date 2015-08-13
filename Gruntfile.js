'use strict';

module.exports = function(grunt) {

	var proxy;

	// Project configuration.
	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			lib: {
				src: [
				'**/*.js',
				'!node_modules/**',
				'!coverage/**'
				]
			},
		},

		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: [ 'test/*spec.js' ]
			}
		},
		
		mocha_phantomjs: {
			options: {
				reporter: 'spec'
			},
			src: ['test/**/*.html']
		},

		mocha_istanbul: {
           
            coveralls: {
                src: ['test/**/*.spec.js'],
                options: {
                    coverage: true,
                    check: {
                        lines: 84,
                        statements: 84,
                        branches: 75,
                        functions: 79
                    }
                }
            }
        },
        
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-mocha-istanbul');
	grunt.loadNpmTasks('grunt-mocha-phantomjs');

	grunt.registerTask('lint', ['jshint']);
	grunt.registerTask('coverage', ['mocha_istanbul']);
	grunt.registerTask('default', ['lint', 'test', 'coverage']);

	grunt.registerTask('startProxy', 'Start the proxy', function() {

		var done = this.async();
		var host = process.env.PORT ? '0.0.0.0' : '127.0.0.1';
		var port = process.env.PORT || 8080;
 
		proxy = require('./test/proxy');

		proxy.listen(port, host, function() {
		    console.log('Running CORS Anywhere on ' + host + ':' + port);
		    done();
		});

	});
	grunt.registerTask('stopProxy', 'Stop the proxy', function() {
		if (proxy !== undefined) {
			proxy.close();
		}
	});

	grunt.registerTask('test', ['mochaTest']);
};
