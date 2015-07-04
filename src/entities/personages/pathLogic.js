play.path = {
		setProperties:  function (entities) {
					for (var i = 0; i < entities.length; i++){
						entities[i].setAll('goingTo',0,false,false,0,true);//index of the point the sprite is moving to
						entities[i].setAll('direction',0,false,false,0,true);//The default direction is 0
						entities[i].setAll('waiting',false,false,false,0,true);//Start without waiting
					}
				},


		/*If a sprite in following a path this function has to be called each frame in order to update the direction
		 * @param: the sprite to move, the data of the sprite from the current level
		 * @result: update the velocity of the sprite
		 */
		updateDirection: function (sprite){
					//Check if the sprite reached the next point of the path and is not waiting
					if (play.path.arrived(sprite,sprite.data.path[sprite.goingTo]) && sprite.waiting == false){
						//If it has to wait set a timer
						if(sprite.data.path[sprite.goingTo].wait > 0){
							sprite.body.velocity.setTo(0,0);
							sprite.waiting = true;
							play.timer.add(sprite.data.path[sprite.goingTo].wait,this.goNext,play,sprite);
							sprite.animations.stop();
						}//Otherwise move to the next node
						else {
							this.goNext(sprite);
						}
						
							
					}
				},
		/*This function takes a sprite and the next node of his path and check if the node 
		* has been reached by the sprite taking into acoount the value of sprite.direction
		* @param: a Phaser.Sprite onbject (with .direction attribute added)
		*/ 
		arrived: function (sprite,node){
			switch (sprite.direction){
				case direction.up:
					return sprite.y <= node.y;
				case direction.down:
					return sprite.y >= node.y;
				case direction.right:
					return sprite.x >= node.x;
				case direction.left:
					return sprite.x <= node.x;
			}
		},
		

		/*If the sprite is following a path, this function will make it go to the next node
		* @param: The sprite to move, an object containing the path
		*/
		goNext: function(sprite){	
					/*First check if the body exist (this test was a fast solution to avoid the issue due to the asynchronus 					* call of this function (timer set to wait in a path node after the sprite has been destroyed)
					*/
					if (!sprite.body)
						return false;
					if (sprite.data.path[sprite.goingTo+1])//check if exist a next point in the path
						sprite.goingTo++;//in this case we move to it
					else
						sprite.goingTo = 0;//if not go to the first point of the path
	
					var angle = play.physics.arcade.moveToXY(sprite,sprite.data.path[sprite.goingTo].x,sprite.data.path[sprite.goingTo].y,sprite.data.speed);
					sprite.direction = fromAngleToDirection(angle);
					sprite.animations.play(getDirectionString(sprite.direction));
					sprite.waiting = false;
				}
};
			
