//Create the boot state
var boot = {
	init: function(){
			//Responsive layout
			this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
			this.scale.setMinMax(200,100,1000,532);	
			this.scale.pageAlignHorizontally = true;
			this.scale.setResizeCallback(function (){ 
						var scale = Math.min(window.innerWidth / this.game.width, window.innerHeight / this.game.height);
								this.scale.setUserScale(scale,scale,0,0);
								},this);
		},
	preload: function(){
			//Get game configuration
			this.load.text('conf','conf.json');
			game.conf = JSON.parse(this.game.cache.getText('conf')); 	
			//We load the image for the loading bar
			this.load.image('preloadbar','assets/images/preloader-bar.png');
			//TODO Load google web fonts
		},
	create: function(){
			//Start the physic system
			this.physics.startSystem(Phaser.Physics.ARCADE);
			
			
			//Change the state
			this.game.state.start('Load');
		}
};

