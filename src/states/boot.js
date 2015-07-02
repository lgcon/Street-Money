//Create the boot state
var boot = {
	preload: function(){
			//We load the image for the loading bar
			this.load.image('preloadbar','assets/images/preloader-bar.png');
		},
	create: function(){
			//Start the physic system
			this.physics.startSystem(Phaser.Physics.ARCADE);
			//Define world bounds
			this.world.setBounds(0,0,2937,532);
			
			//Change the state
			this.game.state.start('Load');
		}
};

