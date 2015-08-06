play.createTreasures = function() { 
				var treasures = this.add.group();
				treasures.enableBody = true;
				for (i = 0; i < play.level.personages.treasures.length; i++){
					treasures.create(play.level.personages.treasures[i].path[0].x,
							      play.level.personages.treasures[i].path[0].y,'treasure');
					treasures.children[i].data = this.level.personages.treasures[i];
					treasures.children[i].body.immovable = true;
				}
				treasures.hit = hitTreasure;	
				treasures.breack = breackTreasure;
				return treasures;
}


/*This function reduce by 1 the life of every treasure distant less than 50px from the player, if the life is 0 the tresure is
* destroyed, and the money it contains are launched in every direction
* @param: none.
*/		
function hitTreasure(){
		for (var i = 0; i < play.treasures.length; i++){
			var treasure = play.treasures.children[i];
			//If the treasure is distant less than 50px from the player
			if (play.physics.arcade.distanceBetween(play.player,treasure) < 50){
				treasure.data.life--;
				this.game.playsound('hit_sound');
				if (treasure.data.life > 0){
					//Display the remaining life
					var lifeInfo = play.add.text(treasure.x,treasure.top-120,
							     treasure.data.life,{font: this.game.textFont, fill:"#FF8000", fontSize: 50});
					play.add.tween(lifeInfo)
						.from({y: treasure.top,alpha: 0},500,Phaser.Easing.Linear.None,true)
						.onComplete.add(lifeInfo.destroy,lifeInfo);
				}
				else {	
					play.treasures.breack(treasure);	
				}
			}
		}
	}

//Launch all the coins and destroy the treasure	
function breackTreasure(treasure){
			this.game.playsound('break_sound');
			var velocityCoins = new Phaser.Point(500,0);
			var angleCoins = 2*Math.PI/treasure.data.coins;
			for (var i = 0; i < treasure.data.coins; i++){
				var coin = play.coins.create(treasure.x,treasure.y,'coin',0)
				coin.body.velocity.setTo(velocityCoins.x,velocityCoins.y);
				coin.body.collideWorldBounds = true;
				coin.anchor.setTo(0.5,1);
				coin.body.setSize(coin.width/2,feetHeight);
				play.keepInTheStreet.push(coin);
				play.add.tween(coin.body.velocity).to({x:0,y:0},1000,Phaser.Easing.Linear.None,true);
				coin.animations.add('spin',[0,1,2,3,4,5,6,7],10,true);
				coin.animations.play('spin');
				velocityCoins.rotate(0,0,angleCoins);
			}
			treasure.destroy();
}	
