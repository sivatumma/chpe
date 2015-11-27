module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    vulcanize: {
      default: {
        options: {
          // Task-specific options go here. 
          // abspath: "/home/siva/Downloads/chpe-polymer-1.0.3/client",
        },
        path: {
          resolve: '/home/siva/Downloads/chpe-polymer-1.0.3'
        },
        files: {
          // Target-specific file lists and/or options go here. 
          "build.html":"client/home.html"
        },
      },
    },
    jshint: {
      all: ['Gruntfile.js', 'client/**/*.js', 'test/**/*.js', 'client/**/*.html', 'test/**/*.html']
    }


  });
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-contrib-copy');
  // grunt.loadNpmTasks('grunt-contrib-jasmine');
  // grunt.loadNpmTasks('grunt-contrib-concat');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-vulcanize');
  // grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['vulcanize']);

};