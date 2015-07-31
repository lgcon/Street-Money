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
			this.city = this.add.tileSprite(0,0,this.world.width,this.world.height,'city');
			//GAME ENTITIES
			this.player = this.createPlayer();				
			this.coins = this.createCoins();	
			this.robbers = this.createRobbers();
			this.treasures = this.createTreasures();
			this.drains = this.createDrains();
			this.oilSpots = this.createOilSpots();
			this.boots = this.createBoots();
			
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
		


			//GAME TEXT 
			var centerX = this.game.width/2;
			var style = {font: this.game.textFont, fill: "#FBEFEF", fontSize: 80};
			//SCORE
			this.score = 0;
			var scorePosition = this.game.conf.positions. text_score;
			this.scoreText = this.add.text(scorePosition.x,scorePosition.y,this.game.lang.text_score,style);
			this.scoreText.count = this.add.text(this.scoreText.right+20,this.scoreText.y,0+'',style);
			this.scoreText.fixedToCamera = true;
			this.scoreText.count.fixedToCamera = true;

			//TIMER
			this.timer = this.createTimer();
			this.timer.start();
			//Display
			var textPosition = this.game.conf.positions.text_timeleft;
			this.timer.text = this.add.text(textPosition.x,textPosition.y,this.game.lang.text_timer,style);
			this.timer.text.count = this.add.text(this.timer.text.right+20,this.timer.text.y,this.timer.left,style);
			this.timer.text.fixedToCamera = true;
			this.timer.text.count.fixedToCamera = true;
			//CAMERA
			this.camera.follow(this.player);
			
			//CONTROLS	
			//Create cursors TODO: Cursor created in another state and a system for mobile devices
			if (this.game.device.desktop) {
				cursors = this.input.keyboard.createCursorKeys();
				this.spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
				this.spacebar.onDown.add(this.treasures.hit);
				this.buttonsToPause = [];
			} else {
				this.hitButton = this.createHitButton(this.game.conf.positions.hitButton.x,
								      this.game.conf.positions.hitButton.y);
				this.joystick = this.createJoystick(this.game.conf.positions.joystick.x,
								    this.game.conf.positions.joystick.y,
								    this.game.conf.positions.joystick.radius);
				this.buttonsToPause = [this.joystick.up,this.joystick.down,this.joystick.right,this.joystick.left,
							this.hitButton];
			}
			//Buttons
			this.add.existing(this.game.speaker);
			this.pauseButton = this.add.button(this.game.speaker.x-100,this.game.speaker.y,'pause_button');
			this.pauseButton.scale.setTo(1.5,1.5);
			this.pauseButton.onInputDown.add(this.startPause,this);
			this.buttonsToPause.push(this.pauseButton);	
			//BOARD & Panels
			this.board = createBoard.call(this,centerX,400,450,450);
			var styleTextButtons = {font: this.game.textFont, fill: "#FBEFEF", fontSize: 30};//TODO use a global var
			//Restart button	
			this.restartButton = this.make.button(this.board.panel.x,this.board.panel.y-80,'play_button');
			this.restartButton.anchor.setTo(0.5);
			this.restartButton.onInputDown.add(function(){this.restartButton.goDown('click_sound');},this);
			this.restartButton.onInputUp.add(function(){this.restartButton.goUp();},this);//TODO restart the level
			this.restartButton.text = this.make.text(0,0,this.game.lang.restart_button,styleTextButtons);
			this.restartButton.text.anchor.setTo(0.5);
			this.restartButton.addChild(this.restartButton.text);
			//Menu button
			this.menuButton = this.make.button(this.board.panel.x,this.board.panel.y+20,'play_button');
			this.menuButton.anchor.setTo(0.5);
			this.menuButton.onInputDown.add(function(){this.menuButton.goDown('click_sound');},this);
			this.menuButton.onInputUp.add(function(){this.menuButton.goUp();this.game.state.start('Menu')},this);
			this.menuButton.text = this.make.text(0,0,this.game.lang.menu_button,styleTextButtons);
			this.menuButton.text.anchor.setTo(0.5);
			this.menuButton.addChild(this.menuButton.text);
			//Resume button
			this.resumeButton = this.make.button(this.board.panel.x,this.board.panel.y+120,'play_button');
			this.resumeButton.anchor.setTo(0.5);
			this.resumeButton.onInputDown.add(function(){this.resumeButton.goDown('click_sound');},this);
			this.resumeButton.onInputUp.add(function(){this.resumeButton.goUp();this.stopPause();},this);//TODO show the resume
			this.resumeButton.text = this.make.text(0,0,this.game.lang.resume_button,styleTextButtons);
			this.resumeButton.text.anchor.setTo(0.5);
			this.resumeButton.addChild(this.resumeButton.text);
			
			//Menus TODO fill
			this.pauseMenu = [this.restartButton,this.menuButton,this.resumeButton];
			this.gameOverMenu = [];
			//MAKE EVERYTHING ISOMETRIC
			this.groundObjects = this.add.group();
			this.groundObjects.addMultiple([this.oilSpots,this.drains]);
			
			this.entitiesToSort = this.add.group();
			this.entitiesToSort.addMultiple([this.player,this.robbers,this.treasures,this.boots,this.coins]);
			//No need to change the 'z' index of the children of the world, they are already ordered	

			//RESIZE BODIES
			setBodyAsFeet(this.entitiesToSort);
			var sprite;
			for (i = 0; i < this.drains.length; i++){
				sprite = this.drains.children[i];
				sprite.body.setSize(10,10,sprite.width/2-5,sprite.height/2-5);
			}
			for (i = 0; i < this.oilSpots.length; i++){
				sprite = this.oilSpots.children[i];
				sprite.body.setSize(sprite.width/2,sprite.height/2,sprite.width/4,sprite.height/4);
			}
			
			//PAUSE
			//Generate a subWorld to stop in order to separate the game from the pause
			this.elementsToPause = this.world.createSubGroup();
			//Move the speaker out of the elements to pause
			this.world.add(this.game.speaker);
			
		},
		update: function(){
			this.player.move();
			//Check for street's up bound
			this.keepInTheStreet.forEach(function(sprite){if (sprite.y < 505) sprite.y = 505;},this);
			//Move the treasures
			for (i = 0; i < this.treasures.children.length;i++)
				this.path.updateDirection(this.treasures.children[i]);
			//COLLISIONS/OVERLAPS
			this.physics.arcade.overlap(this.player,this.coins,this.coins.collect);
			this.physics.arcade.overlap(this.player,this.boots,this.boots.getBonus);
			if (!this.physics.arcade.overlap(this.player,this.oilSpots,this.oilSpots.slip))
				this.player.allowSlip = true;//In order to avoid multiple splip events
			//Check for ovelap with drains
		 	if (!this.physics.arcade.overlap(this.player,this.drains,this.drains.teleport))
				this.player.allowTeleport = true; //If the player is out of any drain, allow teleporting for eventual contacts
			//Check for collision with the robber
			this.physics.arcade.collide(this.player,this.robbers,this.robbers.steal);
			//Check for collisions with the treasures
			this.physics.arcade.collide(this.player,this.treasures);
			//Update display order
			this.entitiesToSort.sort('bottom',Phaser.Group.SORT_ASCENDING,true);
		},
		render: function(){
			this.time.advancedTiming = true;
			this.game.debug.text('fps: '+this.time.fps,200,32);
//			this.game.debug.body(this.player);
//			this.robbers.forEach(this.game.debug.body,this.game.debug);
//			this.treasures.forEach(this.game.debug.body,this.game.debug);
//			this.boots.forEach(this.game.debug.body,this.game.debug);
//			this.coins.forEach(this.game.debug.body,this.game.debug);
//			this.drains.forEach(this.game.debug.body,this.game.debug);
//			this.oilSpots.forEach(this.game.debug.body,this.game.debug);
		},
		shutdown: function(){
			this.world.remove(this.game.speaker);
			if (!this.input.keyboard.enabled)//When in a pause state the keyboard is disabled
				this.input.keyboard.enabled = true;
		},
		startPause: function(){
			if (this.game.soundOn)
				this.sound.play('click_sound');
			//Show the menu
			this.add.existing(this.board);
			for (var i = 0; i < this.pauseMenu.length; i++)
				this.add.existing(this.pauseMenu[i]);
			this.board.setTitle('Pause');
			//Stop everytingh
			this.game.setPause([this.elementsToPause],[this.timer],this.buttonsToPause,true);

			//TODO ISSUE: the canvas render mode create a problem when changing the tint of the timer	
			this.elementsToPause.setAllChildren('tint',0x1C1C1B); 
			if (this.game.renderType == Phaser.CANVAS) //Escamotage due to the issue of pixi relative at the tint of tilesprites
					this.city.alpha = 0.2;
		},
		stopPause: function(){
			this.world.remove(this.board);
			for (var i = 0; i < this.pauseMenu.length; i++)
				this.world.remove(this.pauseMenu[i]);
			this.game.unsetPause([this.elementsToPause],[this.timer],this.buttonsToPause,true);
			this.elementsToPause.setAllChildren('tint',0xFFFFFF);
			if (this.game.renderType == Phaser.CANVAS)
					this.city.alpha = 1;
		}
};
