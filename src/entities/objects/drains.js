play.createDrains = function () { 
			var drains = this.add.group();
			drains.enableBody = true;
			for (i = 0; i < play.level.objects.drains.length; i++){
				drains.create(play.level.objects.drains[i].x,play.level.objects.drains[i].y,'drain')
					.go = play.level.objects.drains[i].go;
			}
			drains.teleport = teleport;
			drains.teleport.go = moveToNextDrain;
			return drains;
	}

/*This function permorms a teleport to the next drain
* @param: the player to teleport, the actual drain which body overlaped with the player
*/
function teleport(player, drain){
		//Teleport only if allowed
		if (player.allowTeleport){
			player.animation = 'fall';
			//We neew to check the value of isTeleporting in order to avoid add multiple timers
			if (player.isTeleporting){
				player.body.velocity.setTo(0,0);
			}
			else {
				player.isTeleporting = true;
				play.timer.add(500,this.go,this,player,drain);
				player.game.playsound('drain_sound');
			}
		}
	}
/*This function move the player to the next drain
* @param: the player to move, the drain from which the player is coming from
*/
function moveToNextDrain(player,drain){
			var nextDrain = play.drains.children[drain.go];
			//Free the camera from following the player
			play.camera.unfollow();
			//Take out the player from the game and move it to the next drain
			play.player.exists = false;
			player.position.setTo(nextDrain.x+nextDrain.width/2,nextDrain.y+nextDrain.height/2);
			//Set a tween to move smoothly the camera to the player
			play.add.tween(play.camera.view)
				.to({x: player.position.x - play.camera.view.halfWidth, 
				     y: player.position.y - play.camera.view.halfHeight},500)
				.start()
				.onComplete.add(function(){
							play.camera.follow(player);
							play.player.exists = true;},play);
											  
			//Don't allow teleport since the player exit the new drain
			player.allowTeleport = false;
			player.isTeleporting = false;
		}	
