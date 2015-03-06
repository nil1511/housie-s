
'use strict';

module.exports = function (grunt) {
  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg      : grunt.file.readJSON('package.json'),
    jshint   : {
      options   : {
        jshintrc : '.jshintrc',
        reporter : require('jshint-stylish')
      },
      gruntfile : {
        src : 'Gruntfile.js'
      },
      files : {
        src : ['index.js']
      }
    },
    watch : {
      scripts: {
        files: ['**/*.js'],
        tasks: ['jshint'],
        options: {
          spawn: false,
          livereload: true,
        },
      },
      configFiles: {
       files: [ 'Gruntfile.js', 'config/*.js' ],
       options: {
         reload: true
       }
     }

    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint']);
};
