var play_intro = {	
			init: function(){
				this.world.width = this.game.width;//restore the width of the world
				//parse the level
				play.level = JSON.parse(this.game.cache.getText('level'+this.game.current_lev));	
			},
			create: function(){
				this.add.existing(this.game.background);
				this.add.existing(this.game.speaker);
				this.game.speaker.cameraOffset.y = this.game.conf.positions.speaker.y;//bring it back to the original position
				//we build the board
				this.board = this.game.createBoard(this.world.centerX,this.world.centerY);
				this.board.visible = true;//show the board
				this.board.fixedToCamera = false;//dont need it
				this.board.label.y += 60;//adjust the position of the label...
				this.board.label.text.y += 60;//..and the text inside it
				this.board.setTitle(this.game.lang.level+' '+this.game.current_lev);
				//text style
				this.textStyle = {font: game.textFont, 
						  fill: game.textstyle.panels.content.color, 
						  fontSize: game.textstyle.panels.content.size,
						  align: 'center'};
				//button
				this.board.button = this.game.createButton(this.board.panel.x,this.board.panel.y+250,'',true,'click_sound');
				this.board.add(this.board.button);
				//if the level has a tutorial, show the tutorial, otherwise go to the info direclty
				if (play.level.tuto && this.game.lang.tutos[this.game.current_lev])
					this.showTuto();
				else
					this.showInfos();
			},
			shutdown: function(){
				//keep the sprites we need for the next state
				this.world.remove(this.game.speaker);
				this.world.remove(this.game.background);
			},
			showTuto: function (){
				this.hasTuto = true;
				var tuto = this.game.lang.tutos[this.game.current_lev];
				this.tutoTitle = this.add.text(this.board.label.x,this.board.label.y+80,tuto.title,this.textStyle);
				this.tutoImg = this.add.image(this.board.panel.x, this.tutoTitle.y+70, 
							      play.level.tuto.image, play.level.tuto.frame);
				this.tutoTxt = this.add.text(this.board.panel.x,this.tutoImg.bottom,tuto.text,this.textStyle);
				this.board.button.setText(this.game.lang.tutos.button);
				this.tutoElements = this.add.group();
				this.tutoElements.addMultiple([this.tutoTitle,this.tutoImg,this.tutoTxt]);
				this.tutoElements.setAll('anchor.x',0.5);
				this.board.addMultiple([this.tutoElements]);
				this.add.tween(this.board).from({y: -720},300,'Linear').start();
				this.board.button.onInputUp.add(function(){this.showInfos();},this);
			},
			showInfos: function(){
				//Clear the board if there was a tuto before
				if (this.hasTuto){
					this.tutoElements.destroy();
				}
				this.infos = this.add.text(0, this.board.panel.y-130,this.game.lang.text_goal+' '+play.level.goal
								+'\n'+this.game.lang.text_time+' '+play.level.time+' '+
								this.game.lang.symbol_seconds,this.textStyle);
				this.infos.x = this.board.panel.x-this.infos.width/2;
				this.infos.align = 'left';
				this.text_preLevel = this.add.text(this.board.panel.x,this.board.panel.y+100,
								   this.game.lang.text_preLevel,this.textStyle);
				this.text_preLevel.anchor.setTo(0.5);
				this.board.button.setText(this.game.lang.start_button);
				this.board.button.onInputUp.add(function(){this.state.start('Play');},this);
				this.board.addMultiple([this.infos,this.text_preLevel]);
				//If this is the first time we see the board (there is no tuto) we set a tween
				if (!this.hasTuto)
					this.add.tween(this.board).from({y: -720},300,'Linear').start();
			}
}
