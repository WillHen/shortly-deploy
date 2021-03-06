module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      //   options: {
      //   separator: ';',
      // },
      // dist: {
        // src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
        'public/theEntireLib.js' :[   'public/lib/underscore.js', 
                                    'public/lib/jquery.js', 
                                  'public/lib/backbone.js', 
                                  'public/lib/handlebars.js' 
                                  ],
        'public/theEntireClient.js' :[ 'public/client/app.js',
                                      'public/client/router.js',
                                      'public/client/link.js',
                                      'public/client/links.js', 
                                      'public/client/linkView.js', 
                                      'public/client/linksView.js', 
                                      'public/client/createLinkView.js' 
                                      ]
        
      //},
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
       my_target :{
        files: {
            'public/dist/theEntireLib.js' : 'public/theEntireLib.js',
            'public/dist/theEntireClient.js' : 'public/theEntireClient.js',
        }
       }
    },

    jshint: {
      files: ['server.js', 'Gruntfile.js', 'test/ServerSpec.js'],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
        options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'public/output.min.css': ['public/*.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

     shell: {
      prodServer: {
        command: 'git push azure master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');


  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
     cmd: 'grunt',
     grunt: true,
     args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', ['jshint', 'concat', 'uglify', 'cssmin']);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
        
    } else {
        grunt.task.run([ 'server-dev' ]);
      }
  });

  grunt.registerTask('deploy', [
      // add your production server task here
  ]);


};
