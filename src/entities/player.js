/*Create and initialize the player
*/
play.createPlayer = function () {
			//PLAYER
			var player = this.add.sprite(this.level.playerStarts.x,this.level.playerStarts.y,'player',0);
			//Add physic body to the player
			this.physics.arcade.enable(player);
			//Walk animation
			player.animations.add('down',[0,1,2,3],10,true);
			player.animations.add('left',[4,5,6,7],10,true);
			player.animations.add('right',[8,9,10,11],10,true);
			player.animations.add('up',[12,13,14,15],10,true);
			player.animations.add('fall',[0,4,8,12],10,true);
			//Player collide world bounds
			player.body.collideWorldBounds = true;
			//Set player speed
			player.speed = game.conf.speed_player;
			player.speed_bonus = this.add.tween(player);
			//Take track of the thefts (timestamp of the last one)
			player.lastTheft = 0;
			//Keep the player inside the street
			this.keepInTheStreet.push(player);
			//Some values to menage the drains-teleporting
			player.allowTeleport = true;
			player.isTeleporting = false;
			//Set update function
			player.move = this.game.device.desktop? moveDesktop : moveMobile;
			player.update = updatePlayer;

			return player;
		}

/*Main function to update the player
*/
function moveMobile() {	
			play.joystick.resetFrames();
			//Move the player
			if (play.joystick.down.isDown){
				play.joystick.down.frame = 1;
				this.body.velocity.setTo(0,this.speed);
				this.animation = 'down'
			}
			else if (play.joystick.left.isDown){
				play.joystick.left.frame = 1;
				this.body.velocity.setTo(-this.speed,0);
				this.animation = 'left'
			}
			else if (play.joystick.right.isDown){
				play.joystick.right.frame = 1;
				this.body.velocity.setTo(this.speed,0);
				this.animation = 'right'
			}
			else if (play.joystick.up.isDown){
				play.joystick.up.frame = 1;
				this.body.velocity.setTo(0,-this.speed);
				this.animation = 'up'
				
			}
			else{
				this.body.velocity.setTo(0,0);
				this.animation = null;
			}
	}
 function moveDesktop() {
			//Move the player
			if (cursors.down.isDown){
				this.body.velocity.setTo(0,this.speed);
				this.animation = 'down'
			}
			else if (cursors.left.isDown){
				this.body.velocity.setTo(-this.speed,0);
				this.animation = 'left'
			}
			else if (cursors.right.isDown ){
				this.body.velocity.setTo(this.speed,0);
				this.animation = 'right'
			}
			else if (cursors.up.isDown ){
				this.body.velocity.setTo(0,-this.speed);
				this.animation = 'up'
				
			}
			else{
				this.body.velocity.setTo(0,0);
				this.animation = null;
			}
	}
function updatePlayer(){
			//Play animation
			if (this.animation)
				this.animations.play(this.animation);
			else
				this.animations.stop();
	}	
