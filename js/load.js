//Create the game state load
var load = {
		preload: function() {
				//Loading screen
				//TODO: Create a responsive good position for the preload bar
				this.preloadBar = this.add.image(100,100,'preloadbar');
				this.load.setPreloadSprite(this.preloadBar);
				//Load assets
			
				//Player
				this.load.spritesheet('player','assets/images/player.png',32,48);
				//Background
				this.load.image('city','assets/images/city.png');
			},
		create: function(){
				this.game.state.start('Menu');
			}

};
						
