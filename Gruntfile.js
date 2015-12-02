module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    vulcanize: {
      default: {
        files: {
          "./build.html":["home.html"]
        },
      },
      abspath: {
        options: {
          abspath: '/home/siva/Downloads/chpe-polymer-1.0.3/client',
          nonull: true,
          target: 'home.html'
        }
      }
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      js: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['Gruntfile.js', 'client/assets/scripts/*.js','client/config/*.js']
      },
      html: {
        options: {
          extract: 'always',
          undef: true,
          latedef: true,
          unused: false,
          browser: true,
          globals: {
           "wrap": true,
           "unwrap": true,
           "Polymer": true,
           "Platform": true,
           "page": true,
           "app": true,
           "schemeBase":true,
           "chUtils":true,
           "MoreRouting":true,
           "generalConfig":true,
           "_":true,
           "google":true,
           "console":true,
           "module":true
          }
        },
        files: {
          src: ['client/components/*.html']
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-contrib-copy');
  // grunt.loadNpmTasks('grunt-contrib-jasmine');
  // grunt.loadNpmTasks('grunt-contrib-concat');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-vulcanize');
  // grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['vulcanize']);

};