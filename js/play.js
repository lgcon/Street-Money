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
			//Get player speed
			player.speed = 200;
			
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

			//OTHER PERSONAGES
			//ROBBER
			this.robbers = this.add.group();
			this.robbers.enableBody = true;
			for (var i = 0; i < this.level.personages.robbers.length; i++){
				this.robbers.create(this.level.personages.robbers[i].path[0].x,this.level.personages.robbers[i].path[0].y,'robber');
				this.robbers.children[i].goingTo = 0; //index of the point the robber is moving to
				this.robbers.children[i].direction = 0;//the default direction is 0
				this.robbers.children[i].timer = this.time.create(false);//the timer we will use to wait beatween each node
				this.robbers.children[i].timer.expired = true;
			}
			//Animations
			this.robbers.callAll('animations.add','animations','down',[0,1,2,3],10,true);
			this.robbers.callAll('animations.add','animations','left',[4,5,6,7],10,true);
			this.robbers.callAll('animations.add','animations','right',[8,9,10,11],10,true);
			this.robbers.callAll('animations.add','animations','up',[12,13,14,15],10,true);	

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
		},
		update: function(){
			//Move the player
			if (cursors.down.isDown){
				player.body.velocity.setTo(0,player.speed);
				player.animations.play('down');
			}
			else if (cursors.left.isDown){
				player.body.velocity.setTo(-player.speed,0);
				player.animations.play('left');
			}
			else if (cursors.right.isDown){
				player.body.velocity.setTo(player.speed,0);
				player.animations.play('right');
			}
			else if (cursors.up.isDown && player.body.y > 400){
				player.body.velocity.setTo(0,-player.speed);
				player.animations.play('up');
				
			}
			else{
				player.body.velocity.setTo(0,0);
				player.animations.stop();
			}
			//Move robber
			this.updateDirection(this.robbers.children[0],this.level.personages.robbers[0]);
			//Chek for overlap with coin
			this.physics.arcade.overlap(player,coins,this.collectCoin,null,this);
			//Check for overlap with boots
			this.physics.arcade.overlap(player,this.boots,this.launchSpeedBonus,null,this);
		},
		render: function(){
			this.time.advancedTiming = true;
			this.game.debug.text('fps: '+this.time.fps,200,32);
		},

		collectCoin: function(player,coin){
				coin.destroy();
				this.score++;
				this.scoreText.setText(languageGame.text_score+this.score);
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
		/*If a sprite in following a path this function has to be called each frame in order to update the direction
		 * @param: the sprite to move, the data of the sprite from the current level
		 * @result: update the velocity of the sprite
		 */
		updateDirection: function(sprite,spriteData){
					//Check if the sprite reached the next point of the path and is not waiting
					if (reachedPathNode(sprite,spriteData.path[sprite.goingTo]) && sprite.timer.expired){
						//If it has to wait set a timer
						if(spriteData.path[sprite.goingTo].wait > 0){
							sprite.body.velocity.setTo(0,0);
							sprite.timer.add(spriteData.path[sprite.goingTo].wait,this.goNextNode,this,sprite,spriteData);
							sprite.timer.start();
							sprite.animations.stop();
						}//Otherwise move to the next node
						else {
							this.goNextNode.bind(this)(sprite,spriteData);
						}
						
							
					}
				},
		/*If the sprite is following a path, this function will make it go to the next node
		* @param: The sprite to move, an object containing the path
		*/
		goNextNode: function(sprite,spriteData){	
					if (spriteData.path[sprite.goingTo+1])//check if exist a next point in the path
						sprite.goingTo++;//in this case we move to it
					else
						sprite.goingTo = 0;//if not go to the first point of the path
	
					var angle = this.physics.arcade.moveToXY(sprite,spriteData.path[sprite.goingTo].x,spriteData.path[sprite.goingTo].y,spriteData.speed);
					sprite.direction = fromAngleToDirection(angle);
					sprite.animations.play(getDirectionString(sprite.direction));
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
