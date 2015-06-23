//Create some variables to identify sprites and groups
//TODO player and coins as internal attributes and cursore created in another state.
var player;
var cursors;
var coins;
//Play state
var play = {
		create: function(){
			//TODO: Use a display order based on the y position of the anchors of every sprite (put the anchor in the bottom)
			//Background
			this.add.image(0,0,'city');
			//Parse the level
			this.level = JSON.parse(this.game.cache.getText('level'+currentLevel));
			
			//STREET BOUDARIES (this array must contain all the sprites that risk to go out of the street and need to stay inside)
			this.keepInTheStreet = [];
			
			//PLAYER
			player = this.add.sprite(this.level.playerStarts.x,this.level.playerStarts.y,'player',0);
			//Add physic body to the player
			this.physics.arcade.enable(player);
			//Walk animation
			player.animations.add('down',[0,1,2,3],10,true);
			player.animations.add('left',[4,5,6,7],10,true);
			player.animations.add('right',[8,9,10,11],10,true);
			player.animations.add('up',[12,13,14,15],10,true);
			//Create cursors TODO: Cursor created in another state and a system for mobile devices
			cursors = this.input.keyboard.createCursorKeys();
			//Player collide world bounds
			player.body.collideWorldBounds = true;
			//Set player speed
			player.speed = 200;
			//Take track of the thefts (timestamp of the last one)
			player.lastTheft = 0;
			//Keep the player inside the street
			this.keepInTheStreet.push(player);
	
			//COINS
			coins = this.add.group();
			coins.enableBody = true;
			//Create initial coins
			for (this.currentCoin = 0;this.currentCoin < this.level.startingCoins;this.currentCoin++){
				coins.create(this.level.coins[this.currentCoin].x,this.level.coins[this.currentCoin].y,'coin',0);
			}
			//Animate them
			coins.callAll('animations.add','animations','spin',[0,1,2,3,4,6,7],10,true);
			coins.callAll('animations.play','animations','spin');

			//BONUSES
			//Speed bonuses
			this.boots = this.add.group();
			this.boots.enableBody = true; 
			//Oil spots
			this.oilSpots = this.add.group();
			this.oilSpots.enableBody = true;
			for (var i = 0; i < this.level.bonuses.oil.length; i++)
				this.oilSpots.create(this.level.bonuses.oil[i].x,this.level.bonuses.oil[i].y,'oil');

			//ROBBERS
			this.robbers = this.add.group();
			this.robbers.enableBody = true;
			for (var i = 0; i < this.level.personages.robbers.length; i++){
				this.robbers.create(this.level.personages.robbers[i].path[0].x,
						    this.level.personages.robbers[i].path[0].y,'robber');
				this.robbers.children[i].body.immovable = true;
				this.robbers.children[i].data = this.level.personages.robbers[i];
			}
			//TREASURES
			this.treasures = this.add.group();
			this.treasures.enableBody = true;
			for (i = 0; i < this.level.personages.treasures.length; i++){
				this.treasures.create(this.level.personages.treasures[i].path[0].x,
						      this.level.personages.treasures[i].path[0].y,'treasure');
				this.treasures.children[i].data = this.level.personages.treasures[i];
				this.treasures.children[i].body.immovable = true;
			}	
			//PATH-FOLLLOWERS PROPERTIES
			var pathBasedPersonages = [this.robbers,this.treasures];
			//Set the properties we need to follow the path for every child inside
			for (i = 0; i < pathBasedPersonages.length; i++){
				pathBasedPersonages[i].setAll('goingTo',0,false,false,0,true);//index of the point the sprite is moving to
				pathBasedPersonages[i].setAll('direction',0,false,false,0,true);//The default direction is 0
				for (var j = 0; j < pathBasedPersonages[i].length; j++){
					pathBasedPersonages[i].children[j].timer = this.time.create(false);//timer to wait beatween each node
					pathBasedPersonages[i].children[j].timer.expired = true;
				}
			}

			//SITHJESTER's ANIMATIONS (spritesheets from sithjester uses the same animations, we can add them together)
			var sithJestersSprites = [this.robbers,this.treasures];
			for (i = 0; i < sithJestersSprites.length; i++){
				sithJestersSprites[i].callAll('animations.add','animations','down',[0,1,2,3],10,true);
				sithJestersSprites[i].callAll('animations.add','animations','left',[4,5,6,7],10,true);
				sithJestersSprites[i].callAll('animations.add','animations','right',[8,9,10,11],10,true);
				sithJestersSprites[i].callAll('animations.add','animations','up',[12,13,14,15],10,true);	
			}
				 
			//SCORE
			this.score = 0;
			//Display
			this.scoreText = this.add.text(10,10,languageGame.text_score+this.score,{font: "40px Impact",fill: "#FBEFEF"});
			this.scoreText.fixedToCamera = true;

			//TIMER
			this.timeLeft = this.level.time;
			this.timer = this.time.create(false);
			this.timer.loop(1000,this.updateTimer,this);
			this.timer.start();
			//Display
			this.timerText = this.add.text(10,60,languageGame.text_timer+this.timeLeft,{font: "40px Impact",fill: "#FBEFEF"});
			this.timerText.fixedToCamera = true;

			//CAMERA
			this.camera.follow(player);

			//ADD SPACEBAR
			this.spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			this.spacebar.onDown.add(this.hitTreasure,this);
		},
		update: function(){
			//Move the player
			if (cursors.down.isDown){
				player.body.velocity.setTo(0,player.speed);
				player.animation = 'down'
			}
			else if (cursors.left.isDown){
				player.body.velocity.setTo(-player.speed,0);
				player.animation = 'left'
			}
			else if (cursors.right.isDown){
				player.body.velocity.setTo(player.speed,0);
				player.animation = 'right'
			}
			else if (cursors.up.isDown ){
				player.body.velocity.setTo(0,-player.speed);
				player.animation = 'up'
				
			}
			else{
				player.body.velocity.setTo(0,0);
				player.animation = null;
			}
			//Check for street's up bound
			this.keepInTheStreet.forEach(function(sprite){if (sprite.y < 400) sprite.y = 400;},this);
			//Move robber
			for (var i = 0; i < this.robbers.children.length; i++)
				this.updateDirection(this.robbers.children[i]);
			//Move the treasures
			for (i = 0; i < this.treasures.children.length;i++)
				this.updateDirection(this.treasures.children[i]);
			//Chek for overlap with coin
			this.physics.arcade.overlap(player,coins,this.collectCoin,null,this);
			//Check for overlap with boots
			this.physics.arcade.overlap(player,this.boots,this.launchSpeedBonus,null,this);
			//Check for overlap with the oil spots
			this.physics.arcade.overlap(player,this.oilSpots,this.slip,null,this);
			//TODO check for ovelap with drains
		//	this.physics.arcade.overlap(player,this.drains,this.teleport,null,this);
			//Check for collision with the robber
			this.physics.arcade.collide(player,this.robbers,this.stealCoin,null,this);
			//Check for collisions with the treasures
			this.physics.arcade.collide(player,this.treasures);
			//Player animation
			if (player.animation)
				player.animations.play(player.animation);
			else
				player.animations.stop();
		},
		render: function(){
			this.time.advancedTiming = true;
			this.game.debug.text('fps: '+this.time.fps,200,32);
		},

		collectCoin: function(player,coin){
				coin.destroy();
				this.score++;
				this.scoreText.setText(languageGame.text_score+this.score);//TODO istead use a function to update the score
				//Add next coin
				if (this.currentCoin < this.level.coins.length){
					var newCoin = coins.create(this.level.coins[this.currentCoin].x,this.level.coins[this.currentCoin].y,'coin');
					newCoin.animations.add('spin',[0,1,2,3,4,5,6,7],10,true);
					newCoin.animations.play('spin');
					this.currentCoin++;
				}
		},
		updateTimer: function(){
				this.timeLeft--;
				//TODO gameover if timeLeft == 0
				//Update text timer
				this.timerText.setText(languageGame.text_timer+this.timeLeft);
				//TIMER BASED EVENTS
				//Speed bonuses
				for ( var i = 0; i < this.level.bonuses.speed.length; i++){
					if (this.level.bonuses.speed[i].time === this.level.time - this.timeLeft){
						this.boots.create(this.level.bonuses.speed[i].x,this.level.bonuses.speed[i].y,'boots');
					}
				}
		},
		launchSpeedBonus: function(player,boots){
				boots.destroy();
				this.add.tween(player).from({speed: 2*player.speed},4000,"Linear",true);
				
		},
		/*Called when the player overlap with an oil spot, make the player slip for 500ms in the direction he was going
		* @param: the player, a reference to the spot ovelapped with the player
		*/
		slip: function(player,spot){
			//Note, tween on the speed are possible because they are updated after the update function
			if (player.body.facing == Phaser.UP)
				this.add.tween(player.body.velocity).from({y: -player.speed},500,"Linear",true);
			if (player.body.facing == Phaser.DOWN)
				this.add.tween(player.body.velocity).from({y: player.speed},500,"Linear",true);
			if (player.body.facing == Phaser.RIGHT)
				this.add.tween(player.body.velocity).from({x: player.speed},500,"Linear",true);
			if (player.body.facing == Phaser.LEFT)
				this.add.tween(player.body.velocity).from({x: -player.speed},500,"Linear",true);
			},	
		/*If a sprite in following a path this function has to be called each frame in order to update the direction
		 * @param: the sprite to move, the data of the sprite from the current level
		 * @result: update the velocity of the sprite
		 */
		updateDirection: function(sprite){
					//Check if the sprite reached the next point of the path and is not waiting
					if (reachedPathNode(sprite,sprite.data.path[sprite.goingTo]) && sprite.timer.expired){
						//If it has to wait set a timer
						if(sprite.data.path[sprite.goingTo].wait > 0){
							sprite.body.velocity.setTo(0,0);
							sprite.timer.add(sprite.data.path[sprite.goingTo].wait,this.goNextNode,this,sprite);
							sprite.timer.start();
							sprite.animations.stop();
						}//Otherwise move to the next node
						else {
							this.goNextNode.bind(this)(sprite);
						}
						
							
					}
				},
		/*If the sprite is following a path, this function will make it go to the next node
		* @param: The sprite to move, an object containing the path
		*/
		goNextNode: function(sprite){	
					/*First check if the body exist (this test was a fast solution to avoid the issue due to the asynchronus 					* call of this function after (timer set to wait in a path node) after the sprite has been destroyed)
					*/
					if (!sprite.body)
						return false;
					if (sprite.data.path[sprite.goingTo+1])//check if exist a next point in the path
						sprite.goingTo++;//in this case we move to it
					else
						sprite.goingTo = 0;//if not go to the first point of the path
	
					var angle = this.physics.arcade.moveToXY(sprite,sprite.data.path[sprite.goingTo].x,sprite.data.path[sprite.goingTo].y,sprite.data.speed);
					sprite.direction = fromAngleToDirection(angle);
					sprite.animations.play(getDirectionString(sprite.direction));
				},
		/*This function is called when the player collide with a robber, takes out 1 from the score and display a -1 text
		* @param: the sprite object of the player and the robber
		*/ 
		stealCoin: function(player,robber){
				//Steal one coin max every 200ms and only if there are coins to steal
				if (this.time.elapsedSince(player.lastTheft) > 200 && this.score > 0){
					this.score--;
					player.lastTheft = this.time.time;
					this.scoreText.setText(languageGame.text_score+this.score);//TODO istead use a function to update the score					
					//Display a -1 when a coin is stolen
					var oneLessWarn = this.add.text(player.x,player.y-100,"-1",{font: "20px Impact",fill: "#FBEFEF"});
					this.add.tween(oneLessWarn).from({y: player.y, alpha: 0},1000,Phaser.Easing.Linear.None,true).onComplete.add(oneLessWarn.destroy,oneLessWarn);

				}
			},
		/*This function reduce by 1 the life of every treasure distant less than 50px from the player, if the life is 0 the tresure is
		* destroyed, and the money it contains are launched in every direction
		* @param: none.
		*/		
		hitTreasure: function(){
				for (var i = 0; i < this.treasures.length; i++){
					var treasure = this.treasures.children[i];
					//If the treasure is distant less than 50px from the player
					if (this.physics.arcade.distanceBetween(player,treasure) < 50){
						treasure.data.life--;
						if (treasure.data.life > 0){
							//Display the remaining life
							var lifeInfo = this.add.text(treasure.x,treasure.y-100,
									     treasure.data.life,{font:"30px Impact",fill:"#FF8000"});		
							this.add.tween(lifeInfo)
								.from({y: treasure.y,alpha: 0},500,Phaser.Easing.Linear.None,true)
								.onComplete.add(lifeInfo.destroy,lifeInfo);
						}
						else {	
							//Launch all the coins and destroy the treasure	
							var velocityCoins = new Phaser.Point(500,0);
							var angleCoins = 2*Math.PI/treasure.data.coins;
							for (var i = 0; i < treasure.data.coins; i++){
								var coin = coins.create(treasure.x,treasure.y,'coin',0)
								coin.body.velocity.setTo(velocityCoins.x,velocityCoins.y);
								coin.body.collideWorldBounds = true;
								this.keepInTheStreet.push(coin);
								this.add.tween(coin.body.velocity).to({x:0,y:0},1000,Phaser.Easing.Linear.None,true);
								coin.animations.add('spin',[0,1,2,3,4,5,6,7],10,true);
								coin.animations.play('spin');
								velocityCoins.rotate(0,0,angleCoins);
							}
							treasure.destroy();
						}
					}
				}
			}

						
				
					
			
			
			
};
// Enumaration of the 4 basical directions
var direction = {up: 0, down:1, right: 2, left: 3};

// Return a string with the direction from an enumeration
function getDirectionString(dir){
	switch (dir){
		case direction.up:
			return "up";
		case direction.down:
			return "down";
		case direction.right:
			return "right";
		case direction.left:
			return "left";
	}
}
		
/*This function takes a sprite and the next node of his path and check if the node 
* has been reached by the sprite taking into acoount the value of sprite.direction
* @param: a Phaser.Sprite onbject (with .direction attribute added)
*/ 
function reachedPathNode(sprite,node){
	switch (sprite.direction){
		case direction.up:
			return sprite.body.y <= node.y;
		case direction.down:
			return sprite.body.y >= node.y;
		case direction.right:
			return sprite.body.x >= node.x;
		case direction.left:
			return sprite.body.x <= node.x;
	}
}

/*This function take one angle as argument and returns one direction between up,down,right and left based on a interval of PI/2
* @param: An angle in radiant
* @return: One direction between up,down,right and left (enumarated)
*/
function fromAngleToDirection(angle){//TODO make it more performant
	var step = Math.PI/4;
	if (angle < -step && angle > -step*3)
		return direction.up;
	else if (angle > step && angle < step*3)
		return direction.down;
	else if (angle > -step && angle < step)
		return direction.right;
	else
		return direction.left;
}
