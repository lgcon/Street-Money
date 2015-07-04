play.createBoots = function() {
			var boots = this.add.group();
			boots.enableBody = true; 
			boots.generate = generateBoots;
			boots.getBonus = launchSpeedBonus;
			return boots;
	} 



function generateBoots(){
		for ( var i = 0; i < play.level.bonuses.speed.length; i++){
			if (play.level.bonuses.speed[i].time === play.level.time - play.timer.left){
				var boots = play.boots.create(play.level.bonuses.speed[i].x,play.level.bonuses.speed[i].y,'boots');	
				boots.body.setSize(boots.width/2,feetHeight,boots.width/4,boots.height-feetHeight);
			}
		}
	}
function launchSpeedBonus(player,boots){
		boots.destroy();
		play.add.tween(player).from({speed: 2*player.speed},4000,"Linear",true);
		
}
