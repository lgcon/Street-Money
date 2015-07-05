//Create the boot state
var boot = {
	preload: function(){
			//We load the image for the loading bar
			this.load.image('preloadbar','assets/images/preloader-bar.png');
		},
	create: function(){
			//Start the physic system
			this.physics.startSystem(Phaser.Physics.ARCADE);
			
			//Responsive layout
			this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
			this.scale.setMinMax(200,100,1000,532);	
			this.scale.pageAlignHorizontally = true;
			this.scale.setResizeCallback(function (){ 
						var scale = Math.min(window.innerWidth / this.game.width, window.innerHeight / this.game.height);
								this.scale.setUserScale(scale,scale,0,0);
								},this);
			//Define world bounds
			this.world.setBounds(0,0,2937,532);
			
			//Change the state
			this.game.state.start('Load');
		}
};

