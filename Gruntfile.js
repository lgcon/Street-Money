module.exports = function(grunt){

	//Grunt configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
			
		
		//Concatenation task
		concat: {
			options: {
				banner: '/* <%= pkg.name %>, version: <%= pkg.version %>, author: <%= pkg.author %> */\n\n',
				
			},
			dist: {
				src: [
					'src/phaser/phaser-multisort.js',
					'src/states/*.js',
					'src/entities/personages/*.js',
					'src/entities/objects/*.js',
					'src/entities/player.js',
					'src/entities/game-elements/*.js',
					'src/others/*.js',
					'src/main.js'
				],
				dest: 'js/money-street.js'
			}
		
		},

		//Minimization task
		uglify: {
			options: {
				enclose: {},
			},
			dist: {
				src: 'js/money-street.js',
				dest: 'js/money-street.min.js'
			}
		}
	});
	
	//Load tasks
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	
	//Register task and commands
	grunt.registerTask('default',['concat','uglify']);
};
		
