/*
 * SuperGenPass
 * http://supergenpass.com/
 */

module.exports = function(grunt) {

  grunt.initConfig({

    meta: { name: 'SuperGenPass' },

	concat: {
		dist: {
			src: ['css/sgp.css', 'bcrypt/bcrypt.css'],
			dest: 'build/concat.css'
		}
	},
	
    app: {
      js: 'build/app.js',
      css: 'build/concat.css',
      files: ['index.html', 'sgp.appcache'],
      src: 'app/',
      dest: 'build/'
    },

    sanitize: {
      dest: 'build/sgp.bookmarklet.js',
      protocol: 'javascript:',
      header: '(function(){',
      footer: '})();',
      codes: [
        ['\\?updated', grunt.template.today('?yyyymmdd')],
        ['%', '%25'],
        ['"', '%22'],
        ['<', '%3C'],
        ['>', '%3E'],
        ['#', '%23'],
        ['@', '%40'],
        [' ', '%20'],
        ['\\&', '%26'],
        ['\\?', '%3F']
      ]
    },

    lint: {
      files: ['js/sgp*.js']
    },

    min: {
      dist: {
        src: [
          'js/jquery.custom.js',
		  'bcrypt/jquery-ui.js',
          'js/jquery.jstorage.js',
          'js/jquery.identicon5.js',
		  'bcrypt/bCrypt.js',
		  'bcrypt/ascii85.js',
          'js/sgp.hash.js',
          'js/sgp.core.js',
          'js/sgp.form.js',
		  'bcrypt/main.js',
        ],
        dest: 'build/app.js'
      },
      bookmarklet: {
        src: ['js/sgp.bookmarklet.js'],
        dest: 'build/sgp.bookmarklet.js'
      },
      loader: {
        src: ['js/sgp.js'],
        dest: 'build/sgp.js'
      },
    }

  });
  
  grunt.registerTask('app', 'Generate self-contained HTML5 app', function() {
    var conf = grunt.config('app');
    conf.files.forEach(function(file) {
      grunt.file.write(conf.dest + file, grunt.template.process(grunt.file.read(conf.src + file), conf));
      console.log('File "'+conf.dest + file+'" created.');
    });
    //Needs v0.4
    //grunt.file.delete(conf.js);
    //console.log('File "'+conf.js+'" deleted.');
  });

  grunt.registerTask('sanitize', 'Generate bookmarklet', function() {
    var conf = grunt.config('sanitize'), file = grunt.file.read(conf.dest);
    conf.codes.forEach(function(code) {
      var regex = new RegExp(code[0], 'g');
      file = file.replace(regex, code[1]);
    });
    if(file.indexOf(conf.protocol) === 0) file = file.substring(conf.protocol.length);
    if(file.indexOf(conf.header) !== 0 && file.indexOf(conf.footer, file.length - conf.footer.length) == -1) file = conf.header + file + conf.footer;
    grunt.file.write(conf.dest, conf.protocol + file);
    console.log('URL-encoded and anonymized bookmarklet.');
  });

  grunt.registerTask('default', 'lint concat min:dist app');
  grunt.registerTask('bookmarklet', 'lint min:bookmarklet sanitize');
  grunt.registerTask('loader', 'lint min:loader');
  grunt.registerTask('all', 'lint min');

};
