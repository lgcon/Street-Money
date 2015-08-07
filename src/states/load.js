//Create the game state load
var load = {	
		preload: function() {
				//Loading screen
				this.preloadBar = this.add.image(180,this.world.centerY,'preloadbar');
				this.preloadBar.scale.setTo(17,7);
				this.load.setPreloadSprite(this.preloadBar);
				var style = {font: game.textFont, fill: "#FBEFEF", fontSize: 100};
				this.add.text(this.world.centerX,this.preloadBar.y-80,'Loading...',style)
					.anchor.setTo(0.5,0.5);
				//Load assets
			
				//Menu
				this.load.image('menu_title','assets/images/menu_title.png');	
				this.load.spritesheet('coin_menu','assets/images/coin_menu.png',100,100);	
				this.load.image('arrow_left','assets/images/arrow_left.png');
				this.load.image('arrow_right','assets/images/arrow_right.png');
				this.load.image('lock','assets/images/lock.png');
				//Language
				this.load.text('language','assets/languages/'+game.conf.lang+'.json');



				//UI
				this.load.image('panel','assets/images/panel.png');
			 	this.load.image('level_label','assets/images/level_label.png');
				this.load.spritesheet('play_button','assets/images/button.png',293,112.5);
				this.load.spritesheet('speaker','assets/images/speaker.png',60,60);
				this.load.image('pause_button','assets/images/pause_button.png');
				this.load.spritesheet('star','assets/images/star.png',95,97);
				//Player
				this.load.spritesheet('player','assets/images/player.png',64,96);
				//Background
				this.load.image('city','assets/images/city.png');
				//Joystick
				this.load.spritesheet('joystick','assets/images/joystick.png',180,144);
				this.load.image('hitButton','assets/images/hitButton.png');

				//Money
				this.load.spritesheet('coin','assets/images/coin.png',64,64);
				//Bonuses
				this.load.image('boots','assets/images/boots.png');
				this.load.image('oil','assets/images/oil_spot.png');
				this.load.image('drain','assets/images/drain.png');
				//Robber
				this.load.spritesheet('robber','assets/images/robber.png',64,96);
				//Treasure
				this.load.spritesheet('treasure','assets/images/treasure.png',64,96);
				//Load the levels TODO load singularly at every call
				for(var i = 1; i < game.conf.total_levels+1;i++){
					this.load.text('level'+i,'assets/levels/level'+i+'.json');
				}
				//Sounds
				this.load.audio('click_sound',['assets/sounds/click.ogg','assets/sounds/click.wma','assets/sounds/click.mp3']);
				this.load.audio('music',['assets/sounds/music.ogg','assets/sounds/music.wma','assets/sounds/music.mp3'],true);
				this.load.audio('coin_sound',['assets/sounds/coin.ogg','assets/sounds/coin.wma','assets/sounds/coin.mp3']);
				this.load.audio('thief_sound',['assets/sounds/thief.ogg','assets/sounds/thief.wma','assets/sounds/thief.mp3']);
				this.load.audio('hit_sound',['assets/sounds/hit.ogg','assets/sounds/hit.wma','assets/sounds/hit.mp3']);
				this.load.audio('break_sound',['assets/sounds/break.ogg','assets/sounds/break.wma','assets/sounds/break.mp3']);
				this.load.audio('drain_sound',['assets/sounds/drain.ogg','assets/sounds/drain.wma','assets/sounds/drain.mp3']);
				this.load.audio('oil_sound',['assets/sounds/oil.ogg','assets/sounds/oil.wma','assets/sounds/oil.mp3']);
				this.load.audio('win_sound',['assets/sounds/win.ogg','assets/sounds/win.wma','assets/sounds/win.mp3']);
				this.load.audio('gameover_sound',['assets/sounds/gameover.ogg','assets/sounds/gameover.wma','assets/sounds/gameover.mp3']);
				this.load.audio('bad_sound',['assets/sounds/bad.ogg','assets/sounds/bad.wma','assets/sounds/bad.mp3']);
				this.load.audio('beep_sound',['assets/sounds/beep.ogg','assets/sounds/beep.wma','assets/sounds/beep.mp3']);
				//Switch state
				this.load.onLoadComplete.add(function(){
					this.game.music = this.add.audio('music',1,true);
					this.game.music.play();
					this.game.state.start('Menu');
					},this);
			}
};
						
