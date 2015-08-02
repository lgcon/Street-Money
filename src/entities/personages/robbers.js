play.createRobbers = function () {
			//ROBBERS
			var robbers = this.add.group();
			robbers.enableBody = true;
			for (var i = 0; i < this.level.personages.robbers.length; i++){
				robbers.create(this.level.personages.robbers[i].path[0].x,
						    this.level.personages.robbers[i].path[0].y,'robber');
				robbers.children[i].body.immovable = true;
				robbers.children[i].data = this.level.personages.robbers[i];
			}
			robbers.steal = stealCoin;
			robbers.update = updateRobbers;
			//Animations and path logic are in the main create method
			return robbers;
		}

/*This function is called when the player collide with a robber, takes out 1 from the score and display a -1 text
* @param: the sprite object of the player and the robber
*/ 
function stealCoin(player,robber){
		//Steal one coin max every 200ms and only if there are coins to steal
		if (play.time.elapsedSince(player.lastTheft) > 200 && play.score > 0){
			play.score--;
			if (play.game.soundOn)
				play.sound.play('thief_sound');
			player.lastTheft = play.time.time;
			play.coinsleftText.count.setText(play.level.goal-play.score);				
			//Display a -1 when a coin is stolen
			var oneLessWarn = play.add.text(player.x,player.y-100,"-1",{font: "20px Impact",fill: "#FBEFEF"});
			play.add.tween(oneLessWarn).from({y: player.y, alpha: 0},1000,Phaser.Easing.Linear.None,true).onComplete.add(oneLessWarn.destroy,oneLessWarn);
		}
}


function updateRobbers(){
		for (var i = 0; i < this.children.length; i++)
			play.path.updateDirection(this.children[i]);
}
