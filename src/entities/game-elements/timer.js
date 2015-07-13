play.createTimer = function(){
		var timer = this.time.create(false);
		timer.left = this.level.time;
		timer.updateTime = updateTime;
		timer.timeLeftEvent = timer.loop(1000,timer.updateTime.bind(timer));
		return timer;
}


function updateTime(){

		this.left--;
		//TODO gameover if timeLeft == 0
		if (this.left === 0){
			this.remove(this.timeLeftEvent);//does it work ?
		}
		//Update text timer
		play.timer.text.count.setText(this.left);
		//TIMER BASED EVENTS
		//Speed bonuses
		play.boots.generate();
}


