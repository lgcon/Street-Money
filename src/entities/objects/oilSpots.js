play.createOilSpots = function () {	
			var oilSpots = this.add.group();
			oilSpots.enableBody = true;
			for (var i = 0; i < play.level.bonuses.oil.length; i++)
				oilSpots.create(this.level.bonuses.oil[i].x,play.level.bonuses.oil[i].y,'oil');
			oilSpots.slip = slip;
			return oilSpots;
}


/*Called when the player overlap with an oil spot, make the player slip for 500ms in the direction he was going
* @param: the player, a reference to the spot ovelapped with the player
*/
function slip(player,spot){
	//Note, tween on the speed are possible because they are updated after the update function
	if (player.body.facing == Phaser.UP)
		play.add.tween(player.body.velocity).from({y: -player.speed},500,"Linear",true);
	if (player.body.facing == Phaser.DOWN)
		play.add.tween(player.body.velocity).from({y: player.speed},500,"Linear",true);
	if (player.body.facing == Phaser.RIGHT){
		player.body.velocity.setTo(0,0);//TODO check better play possibility
		play.add.tween(player.body.velocity).from({x: player.speed},500,"Linear",true);
	}
	if (player.body.facing == Phaser.LEFT)
		play.add.tween(player.body.velocity).from({x: -player.speed},500,"Linear",true);
}	
