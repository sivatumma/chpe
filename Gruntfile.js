module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    vulcanize: {
      dist: {
        options: {
          abspath: 'client/',
          targetUrl: '/home.html'
        },
        files: {
          'client/build.html': 'client/home.html'
        }
      }
    },
    clean: {
      all: ["client/assets/styles/*.min.css", "client/assets/scripts/*.min.js", "client/build.html", "client/assets/scripts/<%= pkg.name %>_concat.js"]
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      js: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['Gruntfile.js', 'client/assets/scripts/*.js', 'client/config/*.js']
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
            "schemeBase": true,
            "chUtils": true,
            "MoreRouting": true,
            "generalConfig": true,
            "_": true,
            "google": true,
            "console": true,
            "module": true
          }
        },
        files: {
          src: ['client/components/*.html']
        }
      }
    },
    concatCss: {},
    concat: {
      dist: {
        src: ["client/external/lodash/lodash.min.js", "client/config/*.js", "client/lib/*.js", "client/assets/scripts/*.js", ],
        dest: 'client/assets/scripts/<%= pkg.name %>_concat.js'
      },
      options: {
        separator: "\n\n\n/******  END OF ONE SCRIPT, STARTING ANOTHER - DONE BY CONCATENATION Grunt *******/\n\n\n"
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      absolute: {
        files: [{
          src: ['client/assets/styles/*.css', '!*.min.css'],
          dest: 'client/assets/styles/main.min.css',
        }]
      }
    },
    uglify: {
      dist:{
        src: 'client/assets/scripts/<%= pkg.name %>_concat.js',
        dest: 'client/assets/scripts/app.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  //grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-contrib-copy');
  // grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-vulcanize');

  grunt.registerTask('default', ['clean','jshint','concat','cssmin','uglify','vulcanize']);
  // grunt.registerTask('default', ['vulcanize']);

};