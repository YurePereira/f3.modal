module.exports = function(grunt) {
  grunt.initConfig({
    uglify: {
      // files: {
      //   src: 'f3.*.js',
      //   dest: '',
      //   expand: true,
      //   //flatten: true,
      //   ext: '.min.js',
      // }
      'f3.modal.min.js': 'f3.modal.js',
    },

    //Sass and Compass
    // compass: {
    //   dist: {
    //     options: {
    //       sassDir: '../sass',
    //       cssDir: '../css',
    //       outputStyle: 'compressed',
    //       cacheDir: '../.sass-cache'
    //     }
    //   },
    //   dist2: {
    //     options: {
    //       sassDir: '../assets/sass',
    //       cssDir: '../assets/css',
    //       outputStyle: 'compressed',
    //       cacheDir: '../assets/.sass-cache'
    //     }
    //   },
    // },

    watch: {
      scripts: {
        files: ['*.js'],
        tasks: ['uglify'],
      }//,
      //styles: {
      //  files: ['../sass/*.scss', '../assets/sass/*.scss'],
      //  tasks: ['compass'],
      //}
    },

  });

  // load plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  //grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['watch:scripts']);

};
