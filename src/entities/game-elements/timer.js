play.createTimer = function(){
		var timer = this.time.create(false);
		timer.left = this.level.time;
		timer.updateTime = updateTime;
		timer.loop(1000,timer.updateTime.bind(timer));
		return timer;
}


function updateTime(){

		this.left--;
		//TODO gameover if timeLeft == 0
		//Update text timer
		play.timerText.setText(languageGame.text_timer+this.left);
		//TIMER BASED EVENTS
		//Speed bonuses
		play.boots.generate();
}


