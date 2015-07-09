//Create some variablesto identify sprites and groups
var cursors;
//Play state
var play = {	
		preload: function(){
			//Parse the level
			this.level = JSON.parse(this.game.cache.getText('level'+game.current_lev));
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
			} else {
				this.hitButton = this.createHitButton(this.game.conf.positions.hitButton.x,
								      this.game.conf.positions.hitButton.y);
				this.joystick = this.createJoystick(this.game.conf.positions.joystick.x,
								    this.game.conf.positions.joystick.y,
								    this.game.conf.positions.joystick.radius);
			}


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
			
		},
		update: function(){
			this.player.move();
			//Check for street's up bound
			this.keepInTheStreet.forEach(function(sprite){if (sprite.y < 505) sprite.y = 505;},this);
			//Move the treasures
			for (i = 0; i < this.treasures.children.length;i++)
				this.path.updateDirection(this.treasures.children[i]);
			//Chek for overlap with coin
			this.physics.arcade.overlap(this.player,this.coins,this.coins.collect);
			this.physics.arcade.overlap(this.player,this.boots,this.boots.getBonus);
			this.physics.arcade.overlap(this.player,this.oilSpots,this.oilSpots.slip);
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
			this.game.debug.body(this.player);
			this.robbers.forEach(this.game.debug.body,this.game.debug);
			this.treasures.forEach(this.game.debug.body,this.game.debug);
			this.boots.forEach(this.game.debug.body,this.game.debug);
			this.coins.forEach(this.game.debug.body,this.game.debug);
			this.drains.forEach(this.game.debug.body,this.game.debug);
			this.oilSpots.forEach(this.game.debug.body,this.game.debug);
		}
};
