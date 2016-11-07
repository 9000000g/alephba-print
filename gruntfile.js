module.exports = function (grunt) {
	'use strict';
	grunt.initConfig({
		exec: {
			run: {
				cmd: './node_modules/.bin/electron .',
				stdout: true,
				stderr: true
			},
			clean: {
				cmd: 'rm -rf ./dist/*',
				stdout: false,
				stderr: false
			},
			build: {
				cmd: function(platform, target){
					return './node_modules/.bin/build --' + platform + ' --' + target;
				},
				stdout: false,
				stderr: false
			}
		}
	});

	
	grunt.registerTask("run", [
		"exec:run"
	]);
	grunt.registerTask("build", [
		"exec:clean",
		"exec:build:win:ia32",
		"exec:build:win:x64"
	]);
	grunt.loadNpmTasks('grunt-exec');
}
