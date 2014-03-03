/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  
  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.0',
      banner: '/*! JS Command Center - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* https://github.com/joelhooks/js-command-center\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Joel Hooks; Licensed MIT */'
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    test: {
      files: ['test/**/*.js']
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', 'src/CommandCenterNamespace.js', 'lib/jshashtable-2.1_src.js', 'lib/EventDispatcher.js', 'src/**/*.js'],
        dest: 'build/js-command-center.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint test'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true
      },
      globals: {}
    },

    uglify: {
      compile: {
        options: {
          mangle: {
            except: ['angular', 'window', 'require']
          }
        },
        files: {
          'build/js-command-center.min.js': '<%= concat.dist.dest %>'
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['concat', 'uglify']);

};
