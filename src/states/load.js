//Create the game state load
var load = {
		preload: function() {
				//Loading screen
				//TODO: Create a responsive good position for the preload bar
				this.preloadBar = this.add.image(100,100,'preloadbar');
				this.load.setPreloadSprite(this.preloadBar);
				//Load assets
			
				//Menu
				this.load.image('menu_title','assets/images/menu_title.png');	
				this.load.image('play_button','assets/images/button.png');
				this.load.image('arrow_left','assets/images/arrow_left.png');
				this.load.image('arrow_right','assets/images/arrow_right.png');
				this.load.image('lock','assets/images/lock.png');
				this.load.spritesheet('speaker','assets/images/speaker.png',64,64,2);
				//Language TODO choose the language?
				this.load.text('language','assets/languages/'+game.conf.lang+'.json');
				//Player
				this.load.spritesheet('player','assets/images/player.png',64,96);
				//Backgroundj
				this.load.image('city','assets/images/city.png');
				//Joystick
				this.load.spritesheet('joystick','assets/images/joystick.png',185,148);
				this.load.image('hitButton','assets/images/hitButton.png');

				//Money
				this.load.spritesheet('coin','assets/images/coin_gold.png',64,64);
				//Bonuses
				this.load.image('boots','assets/images/boots.png');
				this.load.image('oil','assets/images/oil_spot.png');
				this.load.image('drain','assets/images/drain.png');
				//Robber
				this.load.spritesheet('robber','assets/images/robber.png',64,96);
				//Treasure
				this.load.spritesheet('treasure','assets/images/treasure.png',64,96);
				//Load the levels
				for(var i = 1; i < game.conf.total_levels+1;i++){
					this.load.text('level'+i,'assets/levels/level'+i+'.json');
				}
			},
		create: function(){
				this.game.state.start('Menu');
			}
};
						
