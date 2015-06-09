//Create some variables to identify sprites and groups
var player;
var cursors;
//Play state
var play = {
		create: function(){
			//Add the background
			this.add.image(0,0,'city');
			//Add the player sprite
			player = this.add.sprite(400,400,'player',0);
			//Add physic body to the player
			this.physics.arcade.enable(player);
			//Walk animation
			player.animations.add('down',[0,1,2,3],10,true);
			player.animations.add('left',[4,5,6,7],10,true);
			player.animations.add('right',[8,9,10,11],10,true);
			player.animations.add('up',[12,13,14,15],10,true);
			//Create cursors
			cursors = this.input.keyboard.createCursorKeys();
		},
		update: function(){
			//Move the player
			if (cursors.down.isDown){
				player.body.velocity.setTo(0,100);
				player.animations.play('down');
			}
			else if (cursors.left.isDown){
				player.body.velocity.setTo(-100,0);
				player.animations.play('left');
			}
			else if (cursors.right.isDown){
				player.body.velocity.setTo(100,0);
				player.animations.play('right');
			}
			else if (cursors.up.isDown){
				player.body.velocity.setTo(0,-100);
				player.animations.play('up');
			}
			else{
				player.body.velocity.setTo(0,0);
				player.animations.stop();
			}
		}
			
			
};
