var play_intro = {	
			init: function(){
				this.world.width = this.game.width;//Restore the width of the world
				//Parse the level
				play.level = JSON.parse(this.game.cache.getText('level'+this.game.current_lev));	
			},
			create: function(){
				this.add.existing(this.game.background);
				this.add.existing(this.game.speaker);
				this.game.speaker.cameraOffset.y = this.game.conf.positions.speaker.y;//Bring it back to the original position
				//We build the board
				this.board = this.game.createBoard(this.world.centerX,this.world.centerY);
				this.board.visible = true;//show the board
				this.board.fixedToCamera = false;//dont need it
				this.board.label.y += 60;//Adjust the position of the label...
				this.board.label.text.y += 60;//..and the text inside it
				this.style = {font: this.game.textFont, fill: "#FBEFEF", fontSize: 60};
				this.board.setTitle(this.game.lang.level+' '+this.game.current_lev);
				//Button
				this.board.button = this.add.button(this.board.panel.x,this.board.panel.y+250,'play_button');
				this.board.button.anchor.setTo(0.5);
				this.board.button.onInputDown.add(function(){this.board.button.goDown('click_sound');},this);
				this.board.add(this.board.button);
				//If the level has a tutorial, show the tutorial, otherwise go to the info direclty
				if (play.level.tuto && this.game.lang.tutos[this.game.current_lev])
					this.showTuto();
				else
					this.showInfos();
			},
			shutdown: function(){
				//Keep the sprites we need for the next state
				this.world.remove(this.game.speaker);
				this.world.remove(this.game.background);
			},
			showTuto: function (){
				this.hasTuto = true;
				var tuto = this.game.lang.tutos[this.game.current_lev];
				this.tutoTitle = this.add.text(this.board.label.x,this.board.label.y+100,tuto.title,
							{font: this.game.textFont, fill: "#FBEFEF", fontSize: 60});
				this.tutoImg=this.add.image(this.board.panel.x,this.tutoTitle.y+80,play.level.tuto.image,play.level.tuto.frame);
				this.tutoTxt = this.add.text(this.board.panel.x,this.tutoImg.y+60,tuto.text,this.style);
				this.board.button.text = this.add.text(this.board.button.x,this.board.button.y,this.game.lang.tutos.button,
							{font: this.game.textFont, fill: "#FBEFEF", fontSize: 60});
				this.board.button.text.anchor.setTo(0.5,0.5);
				this.tutoElements = this.add.group();
				this.tutoElements.addMultiple([this.tutoTitle,this.tutoImg,this.tutoTxt,this.board.button.text]);
				this.tutoElements.setAll('anchor.x',0.5);
				this.board.add(this.tutoElements);
				this.add.tween(this.board).from({y: -720},300,'Linear').start();
				this.board.button.onInputUp.add(function(){this.board.button.goUp();this.showInfos();},this);
			},
			showInfos: function(){
				//Clear the board if there was a tuto before
				if (this.hasTuto){
					this.tutoElements.destroy();
				}
				this.infos = this.add.text(this.board.panel.x,this.board.panel.y-80,this.game.lang.text_goal+' '+play.level.goal
								+'\n'+this.game.lang.text_time+' '+play.level.time+'s',this.style);
				this.infos.anchor.setTo(0.5);
				this.text_preLevel = this.add.text(this.board.panel.x,this.board.panel.y+100,
								   this.game.lang.text_preLevel,this.style);
				this.text_preLevel.anchor.setTo(0.5);
				this.board.button.text = this.add.text(this.board.button.x,this.board.button.y,this.game.lang.start_button,
							{font: this.game.textFont, fill: "#FBEFEF", fontSize: 60});
				this.board.button.onInputUp.add(function(){this.state.start('Play');},this);
				this.board.button.text.anchor.setTo(0.5,0.5);
				this.board.addMultiple([this.infos,this.text_preLevel,this.board.button.text]);
				//If this is the first time we see the board (there is no tuto) we set a tween
				if (!this.hasTuto)
					this.add.tween(this.board).from({y: -720},300,'Linear').start();
			}
}
