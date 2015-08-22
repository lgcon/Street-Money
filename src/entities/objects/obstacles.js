play.createObstacles = function(key){
		var obstacles = this.add.group();		
		obstacles.enableBody = true;
		var levelObst = this.level.obstacles[key];
		for (var i = 0; i < levelObst.length; i++){
			var newObstacle = obstacles.create(levelObst[i].x,levelObst[i].y,key);
			newObstacle.body.immovable = true;
		}
					
		return obstacles;
}
