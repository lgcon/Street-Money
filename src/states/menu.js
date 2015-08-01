var menu = {
	init: function(){ 
			this.world.width = this.game.width;//Restore the width of the world
	},
	preload: function() {
			this.game.lang = JSON.parse(this.game.cache.getText('language'));
		},
	create: function() {
			if (this.game.background){//If the background has been created in the past
				this.add.existing(this.game.background);
				this.game.background.width = this.world.width;
			}
			else{
				this.game.background = this.add.tileSprite(0,0,this.world.width,this.world.height,'city');
				this.game.background.alpha = 0.5;
			}
			var centerX = this.world.centerX;
			var centerY = this.world.centerY;
			//Title
			this.add.image(centerX, 100, 'menu_title')
				.anchor.setTo(0.5,0.5);
			//Level selector
			//Level
			this.textLevel = this.add.text(centerX,centerY+20,game.current_lev,{font:game.textFont, fill:"#FBEFEF",fontSize:100 });
			this.textLevel.anchor.setTo(0.5,0.5);
			//Text
			this.add.text(centerX,this.textLevel.y-120,game.lang.level_selector,{font:game.textFont, fill: "#FBEFEF",fontSize: 60})
				.anchor.setTo(0.5,0.5);
			//Lock
			this.lock = this.add.image(this.textLevel.x,this.textLevel.y,'lock');
			this.lock.anchor.setTo(0.5,0.5);
			this.lock.visible = false;
			//Arrows
			var distanceArrows = 100;
			this.arrowLeft = this.add.image(centerX-distanceArrows,this.textLevel.y,'arrow_left');
			this.arrowLeft.anchor.setTo(0.5,0.5);
			this.arrowLeft.inputEnabled = true;
			this.arrowLeft.events.onInputDown.add(function(){this.updateLevel(-1);},this);
			this.arrowRight = this.add.image(centerX+distanceArrows,this.textLevel.y,'arrow_right');
			this.arrowRight.anchor.setTo(0.5,0.5);
			this.arrowRight.inputEnabled = true;
			this.arrowRight.events.onInputDown.add(function(){this.updateLevel(1);},this);
			//Play button
			this.playButton = this.add.button(centerX, centerY+180,'play_button');
			this.playButton.anchor.setTo(0.5,0.5);
			this.playButton.text = this.add.text(this.playButton.x,this.playButton.y,game.lang.play_button,
					{font:game.textFont, fill:"#FBEFEF",fontSize: 40});
			this.playButton.text.anchor.setTo(0.5,0.5);
			this.playButton.onInputDown.add(function(){
								if (!this.textLevel.locked)
									this.playButton.goDown('click_sound');
								else
									this.playButton.goDown();//TODO bad sound
							},this);
			this.playButton.onInputUp.add(function(){
								this.playButton.goUp();
								if (!this.textLevel.locked){
									this.state.start('Play-intro');
								}},this);

			//Sound
			if (this.game.speaker){
				this.add.existing(this.game.speaker);
				this.game.speaker.x = this.game.conf.positions.speaker.x;//Bring it back to the original position
			}
			else{
				this.game.speaker = this.add.image(this.game.conf.positions.speaker.x,this.game.conf.positions.speaker.y,'speaker',0);
				this.game.speaker.scale.setTo(1.5,1.5);
				this.game.speaker.fixedToCamera = true;
				this.game.speaker.inputEnabled = true;
				this.game.speaker.events.onInputDown.add(this.switchSound,this);
			}

			//Fullscreen
			this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
			this.input.onDown.add(this.goFullscreen,this);
		},
	shutdown: function (){
				//Keep the sprites we need for the next state
				this.world.remove(this.game.speaker);
				this.world.remove(this.game.background);
	},
	updateLevel: function (step){
			var newLevel = game.current_lev + step;
			if (newLevel < 1 || newLevel > game.conf.total_levels)
				return;
			game.current_lev = newLevel;
			if (this.game.soundOn)
				this.sound.play('click_sound');
			if (newLevel > game.lastPassed){
				if (!this.textLevel.locked){
					this.textLevel.fill = '#BDBDBD';
					this.textLevel.alpha = 0.3;
					this.lock.visible = true;
					this.textLevel.locked = true;
				}	
			
			}
			else {
				if (this.textLevel.locked){
					this.textLevel.fill = '#FBEFEF';
					this.textLevel.alpha = 1;
					this.lock.visible = false;
					this.textLevel.locked = false;
				}
			}
			this.textLevel.setText(game.current_lev);
		},
	switchSound: function() {
			this.sound.play('click_sound');
			if (this.game.speaker.frame == 0){
				this.game.speaker.frame = 1;
				this.game.speaker.alpha = 0.7;
				this.game.soundOn = false;
				this.game.music.stop();				
			}
			else {
				this.game.speaker.frame = 0;
				this.game.speaker.alpha = 1;
				this.game.soundOn = true;
				this.game.music.play();
			}
		},
	goFullscreen: function(){
			this.scale.startFullScreen();
	}

};
