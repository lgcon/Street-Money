var play_intro = {
			preload: function(){
				//Parse the level
				play.level = JSON.parse(this.game.cache.getText('level'+game.current_lev));
				//this.state.start('Play');
			},
			create: function(){
				this.add.existing(this.game.background);
				this.add.existing(this.game.speaker);
				//We build the board
				this.style = {font: this.game.textFont, fill: "#FBEFEF", fontSize: 60};
				this.board = this.add.group();
				this.panel = this.add.image(this.world.centerX,this.world.centerY,'panel');
				this.panel.anchor.setTo(0.5,0.5);
				this.panel.scale.setTo(7,6);
				this.level_text = this.add.text(this.panel.x,this.panel.y-220,this.game.lang.level+' '+this.game.current_lev,
							{font: this.game.textFont, fill: 'orange', fontSize: 80});
				this.level_text.anchor.setTo(0.5);
				this.board.button = this.add.button(this.panel.x,this.panel.y+250,'button_brown');
				this.board.button.anchor.setTo(0.5);
				this.board.addMultiple([this.panel,this.level_text,this.board.button]);
				//If the level has a tutorial, show the tutorial, otherwise go to the info direclty
				if (play.level.tuto && this.game.lang.tutos[this.game.current_lev])
					this.showTuto();
				else
					this.showInfos();
			},
			shutdown: function(){
				//Keep the sprites we need for the next state
				this.world.remove(this.game.speaker);
			},
			showTuto: function (){
				this.hasTuto = true;
				var tuto = this.game.lang.tutos[this.game.current_lev];
				this.tutoTitle = this.add.text(this.level_text.x,this.level_text.y+40,tuto.title,
							{font: this.game.textFont, fill: "#FBEFEF", fontSize: 60});
				this.tutoImg = this.add.image(this.panel.x,this.tutoTitle.y+80,play.level.tuto.image,play.level.tuto.frame);
				this.tutoTxt = this.add.text(this.panel.x,this.tutoImg.y+50,tuto.text,this.style);
				this.textButton = this.add.text(this.board.button.x,this.board.button.y,this.game.lang.tutos.button,
							{font: this.game.textFont, fill: "#FBEFEF", fontSize: 40});
				this.textButton.anchor.setTo(0.5,0.5);
				this.tutoElements = this.add.group();
				this.tutoElements.addMultiple([this.tutoTitle,this.tutoImg,this.tutoTxt,this.textButton]);
				this.tutoElements.setAll('anchor.x',0.5);
				this.board.add(this.tutoElements);
				this.add.tween(this.board).from({y: -500},250,'Linear').start();
				this.board.button.onInputUp.add(this.showInfos,this);
			},
			showInfos: function(){
				if (this.hasTuto){
					this.tutoElements.destroy();
					if (this.game.soundOn)
						this.sound.play('click_sound');
				}
				this.infos = this.add.text(this.panel.x,this.panel.y-80,this.game.lang.text_goal+' '+play.level.goal+'\n'+
									this.game.lang.text_time+' '+play.level.time+'s',this.style);
				this.infos.anchor.setTo(0.5);
				this.text_preLevel = this.add.text(this.panel.x,this.panel.y+100,this.game.lang.text_preLevel,this.style);
				this.text_preLevel.anchor.setTo(0.5);
				this.textButton = this.add.text(this.board.button.x,this.board.button.y,this.game.lang.start_button,
							{font: this.game.textFont, fill: "#FBEFEF", fontSize: 40});
				this.board.button.onInputUp.add(this.startLevel,this);
				this.textButton.anchor.setTo(0.5,0.5);
				this.board.addMultiple([this.infos,this.text_preLevel,this.textButton]);
				//If this is the first time we see the board (there is no tuto) we set a tween
				if (!this.hasTuto)
					this.add.tween(this.board).from({y: -500},250,'Linear').start();
			},
			startLevel: function (){
				if (this.game.soundOn)
					this.sound.play('click_sound');
				this.state.start('Play');
			}
}
