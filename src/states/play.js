//Create some variablesto identify sprites and groups
var cursors;
//Play state
var play = {	
		preload: function(){
			//Define world bounds
			this.world.setBounds(0,0,this.level.width,750);
			//STREET BOUDARIES (this array must contain all the sprites that risk to go out of the street and need to stay inside)
			//!!ATTENTION!! in order to deal with different height of sprites the anchor has to be set on the bottom
			this.keepInTheStreet = [];
		},
		create: function(){
			//Background
			this.add.existing(this.game.background);
			this.game.background.width = this.world.width;
			this.game.background.alpha = 1;
			//GAME ENTITIES
			this.player = this.createPlayer();				
			this.coins = this.createCoins();	
			this.robbers = this.createRobbers();
			this.treasures = this.createTreasures();
			this.drains = this.createDrains();
			this.oilSpots = this.createOilSpots();
			this.boots = this.createBoots();
			//Obstacles
			this.boxes = this.createObstacles('box');
			this.trashes = this.createObstacles('trash');
			
			//PATH-FOLLLOWERS PROPERTIES
			var pathBasedPersonages = [this.robbers,this.treasures];
			this.path.setProperties(pathBasedPersonages);

			//SITHJESTER's ANIMATIONS (spritesheets from sithjester uses the same animations, we can add them together)
			var sithJestersSprites = [this.robbers,this.treasures];
			for (i = 0; i < sithJestersSprites.length; i++){
				sithJestersSprites[i].callAll('animations.add','animations','down',[0,1,2,3],10,true);
				sithJestersSprites[i].callAll('animations.add','animations','left',[4,5,6,7],10,true);
				sithJestersSprites[i].callAll('animations.add','animations','right',[8,9,10,11],10,true);
				sithJestersSprites[i].callAll('animations.add','animations','up',[12,13,14,15],10,true);	
			}
		

			//MAKE EVERYTHING ISOMETRIC
			this.groundObjects = this.add.group();
			this.groundObjects.addMultiple([this.oilSpots,this.drains]);
			this.entitiesToSort = this.add.group();
			this.entitiesToSort.addMultiple([this.player,this.robbers,this.treasures,this.coins,this.boxes,this.trashes]);
			//No need to change the 'z' index of the children of the world, they are already ordered	

			//RESIZE BODIES
			setBodyAsFeet(this.entitiesToSort);
			this.entitiesToSort.add(this.boots);
			var sprite;
			for (i = 0; i < this.drains.length; i++){
				sprite = this.drains.children[i];
				sprite.body.setSize(10,10,sprite.width/2-5,sprite.height/2-5);
			}
			for (i = 0; i < this.oilSpots.length; i++){
				sprite = this.oilSpots.children[i];
				sprite.body.setSize(sprite.width/2,sprite.height/2,sprite.width/4,sprite.height/4);
			}

			//CONTROLS	
			if (this.game.device.desktop) {
				cursors = this.input.keyboard.createCursorKeys();
				this.spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
				this.spacebar.onDown.add(this.treasures.hit);
				this.buttonsToPause = [];
			} else {
				var bottomAreaHeight = 393;
				//Adapt for mobile devices (commands should be on the bottom)
				//Create the space for the controls
				this.street = this.add.group();
				this.street.addMultiple([this.game.background,this.groundObjects,this.entitiesToSort]);
				this.street.y -= bottomAreaHeight;
				//Create touch controls
				this.hitButton = this.createHitButton(this.game.conf.positions.hitButton.x,
								      this.game.conf.positions.hitButton.y);
				this.joystick = this.createJoystick(this.game.conf.positions.joystick.x,
								    this.game.conf.positions.joystick.y,
								    this.game.conf.positions.joystick.radius);
				this.buttonsToPause = [this.joystick.up,this.joystick.down,this.joystick.right,this.joystick.left,
							this.hitButton];
			}

			//GAME TEXT 
			var centerX = this.game.width/2;
			this.textStyle = {font: game.textFont, fill: game.textstyle.gameinfo.color, fontSize: game.textstyle.gameinfo.size};
			//SCORE
			this.score = 0;
			var scorePosition = this.game.conf.positions.text_score;
			this.coinsleftText = this.add.text(scorePosition.x,scorePosition.y,this.game.lang.text_score,this.textStyle);
			this.coinsleftText.count = this.add.text(this.coinsleftText.right+20,this.coinsleftText.y,play.level.goal,
								 this.textStyle);
			this.coinsleftText.fixedToCamera = true;
			this.coinsleftText.count.fixedToCamera = true;

			//TIMER
			this.timer = this.createTimer();
			this.timer.start();
			//Display
			var textPosition = this.game.conf.positions.text_timeleft;
			this.timer.text = this.add.text(textPosition.x,textPosition.y,this.game.lang.text_timer,this.textStyle);
			this.timer.text.count = this.add.text(this.timer.text.right+20,this.timer.text.y,this.timer.left,this.textStyle);
			this.timer.text.fixedToCamera = true;
			this.timer.text.count.fixedToCamera = true;
			//CAMERA
			this.camera.follow(this.player);
			
			//Buttons
			this.add.existing(this.game.speaker);
			this.pauseButton = this.add.button(this.game.conf.positions.pauseButton.x,
							   this.game.conf.positions.pauseButton.y,'pause_button');
			this.pauseButton.scale.setTo(1.5,1.5);
			this.pauseButton.fixedToCamera = true;
			this.pauseButton.onInputDown.add(this.startPause,this);
			this.buttonsToPause.push(this.pauseButton);	

			//Reposition (for mobile)
			if (!this.game.device.desktop){
				this.coinsleftText.cameraOffset.y += this.world.height - bottomAreaHeight;
				this.coinsleftText.count.cameraOffset.y += this.world.height - bottomAreaHeight;
				this.timer.text.cameraOffset.y += this.world.height - bottomAreaHeight;
				this.timer.text.count.cameraOffset.y += this.world.height - bottomAreaHeight;
				this.pauseButton.cameraOffset.y += this.world.height - bottomAreaHeight;
				this.game.speaker.cameraOffset.y = this.game.conf.positions.speaker.y + this.world.height - bottomAreaHeight;
			}

			//BOARD & Panels
			this.board = this.game.createBoard(centerX,400,550,550);
			//Restart button	
			this.restartButton = this.game.createButton(this.board.panel.x,this.board.panel.y-105,
								    this.game.lang.restart_button,true,'click_sound');
			this.restartButton.onInputUp.add(function(){this.game.state.start('Play-intro');},this);
			//Menu button
			this.menuButton = this.game.createButton(this.board.panel.x,this.board.panel.y+35,
								 this.game.lang.menu_button,true,'click_sound');
			this.menuButton.onInputUp.add(function(){this.game.state.start('Menu')},this);
			//Resume button
			this.resumeButton = this.game.createButton(this.board.panel.x,this.board.panel.y+175,
								   this.game.lang.resume_button,true,'click_sound');
			this.resumeButton.onInputUp.add(this.stopPause,this);
			//Next Level button
			this.nextlevelButton = this.game.createButton(centerX+170,500,this.game.lang.goNextLevel_button,false);
			this.nextlevelButton.onInputDown.add(function(){
								if (this.game.current_lev >= this.game.conf.total_levels)
									this.nextlevelButton.goDown('bad_sound');
								else
									this.nextlevelButton.goDown('click_sound');
							     },this);
			this.nextlevelButton.onInputUp.add(function(){this.nextlevelButton.goUp();this.startNextLevel();},this);
			//Lets use a group to definei some common properties to the buttons
			this.board.buttons.addMultiple([this.restartButton,this.menuButton,this.resumeButton,this.nextlevelButton]);	
			this.board.buttons.setAllChildren('visible',false);
			this.board.buttons.fixedToCamera = true;
			
			//Menus
			this.pauseMenu = [this.restartButton,this.menuButton,this.resumeButton];
			this.gameoverMenu = [this.restartButton,this.menuButton];
			this.levelpassedMenu = [this.restartButton,this.nextlevelButton];

			//PAUSE
			//Generate a subWorld to stop in order to separate the game from the pause
			this.elementsToPause = this.world.createSubGroup();
			//Move out of the subWorld the elements that shouldn't be paused
			this.world.addMultiple([this.game.speaker,this.board,this.board.buttons]);
			
		},
		update: function(){
			this.player.move();
			//Check for street's up bound
			this.keepInTheStreet.forEach(function(sprite){if (sprite.y < 505) 
										sprite.y = 505;
								      else if (sprite.y > this.game.height)
										sprite.y = this.game.height},this);
			//Move the treasures
			for (i = 0; i < this.treasures.children.length;i++)
				this.path.updateDirection(this.treasures.children[i]);
			//COLLISIONS/OVERLAPS
			this.physics.arcade.overlap(this.player,this.coins,this.coins.collect);
			this.physics.arcade.overlap(this.player,this.boots,this.boots.getBonus);
			if (!this.physics.arcade.overlap(this.player,this.oilSpots,this.oilSpots.slip))
				this.player.allowSlip = true;//In order to avoid multiple splip events
			//Check for ovelap with drains
		 	if (!this.physics.arcade.overlap(this.player,this.drains,this.drains.teleport) && this.player.exists)
				this.player.allowTeleport = true; //If the player is out of any drain, allow teleporting for eventual contacts
			//Check for collisions with the treasures
			this.physics.arcade.collide(this.player,this.treasures);
			//Check for collision with the robber
			this.physics.arcade.collide(this.player,this.robbers,this.robbers.steal);
			//Check for collisions with obstacles
			this.physics.arcade.collide(this.player,this.boxes);
			this.physics.arcade.collide(this.player,this.trashes);
			//Update display order
			this.entitiesToSort.sort('bottom',Phaser.Group.SORT_ASCENDING,true);
		},
		render: function(){
//			this.time.advancedTiming = true;
//			this.game.debug.text('fps: '+this.time.fps,200,32);
//			this.game.debug.body(this.player);
//			this.robbers.forEach(this.game.debug.body,this.game.debug);
//			this.treasures.forEach(this.game.debug.body,this.game.debug);
//			this.boots.forEach(this.game.debug.body,this.game.debug);
//			this.coins.forEach(this.game.debug.body,this.game.debug);
//			this.drains.forEach(this.game.debug.body,this.game.debug);
//			this.oilSpots.forEach(this.game.debug.body,this.game.debug);
		},
		shutdown: function(){
			//Remove the object we need to use later
			this.world.remove(this.game.speaker);
			this.game.background.parent.removeChild(this.game.background);
			//Restore some values
			this.game.background.alpha = 0.5;	
			this.game.background.tint = 0xFFFFFF;
			if (!this.input.keyboard.enabled)//When in a pause state the keyboard is disabled
				this.input.keyboard.enabled = true;
		},
		startPause: function(){
			this.game.playsound('click_sound');
			//Show the menu
			this.board.visible = true;
			for (var i = 0; i < this.pauseMenu.length; i++)
				this.pauseMenu[i].visible = true;
			this.board.setTitle(game.lang.pause_menu);
			//Block game
			this.pauseGame();
		},
		stopPause: function(){
			this.board.visible = false;
			for (var i = 0; i < this.pauseMenu.length; i++)
				this.pauseMenu[i].visible = false;
			this.game.unsetPause([this.elementsToPause],[this.timer],this.buttonsToPause,true);
			this.elementsToPause.setAllChildren('tint',0xFFFFFF);
			if (this.game.renderType == Phaser.CANVAS)
					this.game.background.alpha = 1;
		},
		gameover: function(){
			//Restyle the panel
			this.board.panel.height = 400;
			this.board.label.text.fontSize = 80;
			this.board.label.y = this.board.panel.top;
			this.board.label.text.y = this.board.panel.top;
			this.board.buttons.cameraOffset.y += 70;
			//Play sound
			this.game.playsound('gameover_sound');
			//Show the menu
			this.board.visible = true;
			for (var i = 0; i < this.gameoverMenu.length; i++)
				this.gameoverMenu[i].visible = true;
			this.board.setTitle(game.lang.gameover_menu);
			//Block game
			this.pauseGame();
		},
		levelpassed: function(){
			//Block game
			this.pauseGame();
			//Update player results
			if (localStorage.lastUnblockedLevel < game.conf.total_levels && localStorage.lastUnblockedLevel == game.current_lev)
				localStorage.lastUnblockedLevel++;
			//Game complete
			var gameCompleted = game.current_lev == game.conf.total_levels;
			//Play sound
			this.game.playsound('win_sound');
			//Text
			var textContent = (gameCompleted)? game.lang.game_completed : game.lang.levelpassed;
			var textVictory = this.add.text(this.camera.x+this.game.width/2,200,textContent,
				{font: game.textFont, fill: game.textstyle.levelpassed.color, fontSize: game.textstyle.levelpassed.size});
			textVictory.anchor.setTo(0.5);		
			//Stars
			//var levelScore = this.timer.left/this.level.time;
			var stars = [];
			for (var i = 0; i < 3; i++){//Create 3 stars
				stars.push(this.add.image(textVictory.x-150+i*150,textVictory.y+120,'star',0));
				stars[i].anchor.setTo(0.5);
			}
			//if (levelScore <= 0.3){//More than 70% of the time
			if (this.timer.left < 6){
				stars[2].frame = 1;
				//if (levelScore <= 0.2)//More than 80% of the time
				if (this.timer.left < 4)
					stars[1].frame = 1;
			}
			//Buttons
			for (var i = 0; i < this.levelpassedMenu.length; i++)
				this.levelpassedMenu[i].visible = true;
			this.restartButton.x = this.nextlevelButton.x-340;
			this.restartButton.y = this.nextlevelButton.y;

			if (gameCompleted){
				this.menuButton.x = this.nextlevelButton.x;
				this.menuButton.y = this.nextlevelButton.y;
				this.menuButton.visible = true;
				this.nextlevelButton.visible = false;
			}
		
			
			
			
		},
		startNextLevel: function() {
			if (this.game.current_lev >= this.game.conf.total_levels)
				return;
			this.game.current_lev++;
			this.state.start('Play-intro');
		},
		pauseGame: function(){
			//Stop everything
			this.game.setPause([this.elementsToPause],[this.timer],this.buttonsToPause,true);

			//ATTENTION: the canvas render mode create a problem when changing the tint of the timer	
			this.elementsToPause.setAllChildren('tint',0x1C1C1B); 
			if (this.game.renderType == Phaser.CANVAS) //Escamotage due to the issue of pixi relative at the tint of tilesprites
					this.game.background.alpha = 0.2;
		}
			
};
