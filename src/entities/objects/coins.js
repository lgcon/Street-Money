play.createCoins = function () {
			//COINS
			var coins = this.add.group();
			coins.enableBody = true;
			//Create initial coins
			for (this.currentCoin = 0;this.currentCoin < this.level.startingCoins;this.currentCoin++){
				coins.create(this.level.coins[this.currentCoin].x,this.level.coins[this.currentCoin].y,'coin',0);
			}
			//Animate them
			coins.callAll('animations.add','animations','spin',[0,1,2,3,4,6,7],10,true);
			coins.callAll('animations.play','animations','spin');

			coins.collect = collectCoin;
			
			return coins;
	}

function collectCoin(player, coin){
			coin.destroy();
			player.game.playsound('coin_sound');	
			//Add next coin
			if (play.currentCoin < play.level.coins.length){
				var newCoin = play.coins.create(play.level.coins[play.currentCoin].x,play.level.coins[play.currentCoin].y,'coin');
				newCoin.animations.add('spin',[0,1,2,3,4,5,6,7],10,true);
				newCoin.animations.play('spin');
				setBodyAsFeet(newCoin);	
				play.currentCoin++;
			}
			//Calculate and show score
			var coinsLeft = play.level.goal-play.score-1;
			if (coinsLeft >= 0){
		       		play.score++;
				play.coinsleftText.count.setText(coinsLeft);
				if (coinsLeft == 0)
					play.levelpassed();
			}
				
		
	}
