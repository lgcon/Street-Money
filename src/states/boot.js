//Create the boot state
var boot = {
	init: function(){
			//First of all, resize the game and make it responsive
			this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
			this.scale.setMinMax(200,100,1200,750);	
			this.scale.pageAlignHorizontally = true;
			this.scale.setResizeCallback(function (){ 
						var scale = Math.min(window.innerWidth / this.game.width, window.innerHeight / this.game.height);
								this.scale.setUserScale(scale,scale,0,0);
								},this);
		},
	preload: function(){
			//Load game configuration
			this.load.text('conf','./config.json');
			//We load the image for the loading bar
			this.load.image('preloadbar','assets/images/preloader-bar.png');
			//Set physic system	
			this.physics.startSystem(Phaser.Physics.ARCADE);
			//Turn on sounds
			this.game.soundOn = true;
		},
	create: function(){
			//Parse game configuration file
			game.conf = JSON.parse(this.game.cache.getText('conf')); 	
			//Some easier path
			game.textFont = game.conf.font.name;
			game.lastPassed = 1; //TODO use coockies to get this value
			game.current_lev = game.lastPassed;
			//Load google web fonts
			WebFont.load({
				google: {
					families: [game.conf.font.family]
				},
				active: function(){
					//Change state when complete (make sure the font has loaded)
					game.state.start('Load');
				}
			}); 
		}
};

