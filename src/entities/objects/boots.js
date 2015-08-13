play.createBoots = function() {
			var boots = this.add.group();
			boots.enableBody = true; 
			boots.generate = generateBoots;
			boots.getBonus = launchSpeedBonus;
			play.timer = {left: play.level.time};//Need this value in order to generate the boots with time = 0
			boots.generate();
			return boots;
	} 



function generateBoots(){
		for ( var i = 0; i < play.level.objects.boots.length; i++){
			if (play.level.objects.boots[i].time === play.level.time - play.timer.left){
				var boots = this.create(play.level.objects.boots[i].x,play.level.objects.boots[i].y,'boots');	
				setBodyAsFeet(boots);
			}
		}
}

function launchSpeedBonus(player,boots){
		boots.destroy();
		var bonus = game.add.tween(player);
		if (play.player.speed_bonus.isRunning){
			var tween_data = play.player.speed_bonus.timeline[0];
			var timeLeft = tween_data.duration - tween_data.dt;
			var currentSpeed = play.player.speed;
			play.player.speed = game.conf.speed_player;
			play.player.speed_bonus.stop();
			play.player.speed_bonus = bonus.from({speed: 2*currentSpeed},4000+timeLeft,"Linear",true);
		} else{
			play.player.speed_bonus = bonus.from({speed: 2*player.speed},4000,"Linear",true);
		}
		
}
