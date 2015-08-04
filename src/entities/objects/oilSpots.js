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
	if (player.allowSlip){
		player.allowSlip = false;
		player.game.playsound('oil_sound');
		//Note, tween on the speed are possible because they are updated after the update function
		console.log(player.body.velocity.x);
		if (player.body.facing == Phaser.UP || player.body.facing == Phaser.DOWN)
			play.add.tween(player.body.velocity).to({y: 0},1500,"Linear",true);
		else
			play.add.tween(player.body.velocity).to({x: 0},1500,"Linear",true);	
	}
}	
