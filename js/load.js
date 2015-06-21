//Create the game state load
var load = {
		preload: function() {
				//Loading screen
				//TODO: Create a responsive good position for the preload bar
				this.preloadBar = this.add.image(100,100,'preloadbar');
				this.load.setPreloadSprite(this.preloadBar);
				//Load assets
				
				//Language TODO choose the language?
				this.load.text('language','assets/languages/english.json');
				//Player
				this.load.spritesheet('player','assets/images/player.png',32,48);
				//Background
				this.load.image('city','assets/images/city.png');
				//Money
				this.load.spritesheet('coin','assets/images/coin_gold.png',32,32);
				//Bonuses
				this.load.image('boots','assets/images/boots.png');
				this.load.image('oil','assets/images/oil_spot.png');
				//Robber
				this.load.spritesheet('robber','assets/images/robber.png',32,48);
				//Treasure
				this.load.spritesheet('treasure','assets/images/treasure.png',32,48);
				//Load the levels
				for(var i = 1; i < totalLevels+1;i++){
					this.load.text('level'+i,'assets/levels/level'+i+'.json');
				}
			},
		create: function(){
				this.game.state.start('Menu');
			}

};
						
