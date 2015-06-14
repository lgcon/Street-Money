//Create some variables to identify sprites and groups
//TODO player and coins as internal attributes and cursore created in another state.
var player;
var cursors;
var coins;
//Play state
var play = {
		create: function(){
			//Background
			this.add.image(0,0,'city');
			//Parse the level
			this.level = JSON.parse(this.game.cache.getText('level'+currentLevel));

			//PLAYER
			player = this.add.sprite(this.level.playerStarts.x,this.level.playerStarts.y,'player',0);
			//Add physic body to the player
			this.physics.arcade.enable(player);
			//Walk animation
			player.animations.add('down',[0,1,2,3],10,true);
			player.animations.add('left',[4,5,6,7],10,true);
			player.animations.add('right',[8,9,10,11],10,true);
			player.animations.add('up',[12,13,14,15],10,true);
			//Create cursors TODO: Cursor created in another state and a system for mobile devices
			cursors = this.input.keyboard.createCursorKeys();
			//Player collide world bounds
			player.body.collideWorldBounds = true;
			//Get player speed
			player.speed = 200;
			
			//COINS
			coins = this.add.group();
			coins.enableBody = true;
			//Create initial coins
			for (this.currentCoin = 0;this.currentCoin < this.level.startingCoins;this.currentCoin++){
				coins.create(this.level.coins[this.currentCoin].x,this.level.coins[this.currentCoin].y,'coin',0);
			}
			//Animate them
			coins.callAll('animations.add','animations','spin',[0,1,2,3,4,6,7],10,true);
			coins.callAll('animations.play','animations','spin');

			//BONUSES
			//Speed bonuses
			this.boots = this.add.group();
			this.boots.enableBody = true; 

			//OTHER PERSONAGES
			//ROBBER
			this.robbers = this.add.group();
			this.robbers.enableBody = true;
			for (var i = 0; i < this.level.personages.robbers.length; i++){
				this.robbers.create(this.level.personages.robbers[i].path[0].x,this.level.personages.robbers[i].path[0].y,'robber');
			}
			//Animations
			this.robbers.callAll('animations.add','animations','down',[0,1,2,3],10,true);
			this.robbers.callAll('animations.add','animations','left',[4,5,6,7],10,true);
			this.robbers.callAll('animations.add','animations','right',[8,9,10,11],10,true);
			this.robbers.callAll('animations.add','animations','up',[12,13,14,15],10,true);	

			//SCORE
			this.score = 0;
			//Display
			this.scoreText = this.add.text(10,10,languageGame.text_score+this.score,{font: "40px Impact",fill: "#FBEFEF"});
			this.scoreText.fixedToCamera = true;

			//TIMER
			this.timeLeft = this.level.time;
			this.timer = this.time.create(false);
			this.timer.loop(1000,this.updateTimer,this);
			this.timer.start();
			//Display
			this.timerText = this.add.text(10,60,languageGame.text_timer+this.timeLeft,{font: "40px Impact",fill: "#FBEFEF"});
			this.timerText.fixedToCamera = true;

			//CAMERA
			this.camera.follow(player);
		},
		update: function(){
			//Move the player
			if (cursors.down.isDown){
				player.body.velocity.setTo(0,player.speed);
				player.animations.play('down');
			}
			else if (cursors.left.isDown){
				player.body.velocity.setTo(-player.speed,0);
				player.animations.play('left');
			}
			else if (cursors.right.isDown){
				player.body.velocity.setTo(player.speed,0);
				player.animations.play('right');
			}
			else if (cursors.up.isDown && player.body.y > 400){
				player.body.velocity.setTo(0,-player.speed);
				player.animations.play('up');
				
			}
			else{
				player.body.velocity.setTo(0,0);
				player.animations.stop();
			}
			//Chek for overlap with coin
			this.physics.arcade.overlap(player,coins,this.collectCoin,null,this);
			//Check for overlap with boots
			this.physics.arcade.overlap(player,this.boots,this.launchSpeedBonus,null,this);
		},

		collectCoin: function(player,coin){
				coin.destroy();
				this.score++;
				this.scoreText.setText(languageGame.text_score+this.score);
				//Add next coin
				if (this.currentCoin < this.level.coins.length){
					var newCoin = coins.create(this.level.coins[this.currentCoin].x,this.level.coins[this.currentCoin].y,'coin');
					newCoin.animations.add('spin',[0,1,2,3,4,5,6,7],10,true);
					newCoin.animations.play('spin');
					this.currentCoin++;
				}
		},
		updateTimer: function(){
				this.timeLeft--;
				//TODO gameover if timeLeft == 0
				//Update text timer
				this.timerText.setText(languageGame.text_timer+this.timeLeft);
				//TIMER BASED EVENTS
				//Speed bonuses
				for ( var i = 0; i < this.level.bonuses.speed.length; i++){
					if (this.level.bonuses.speed[i].time === this.level.time - this.timeLeft){
						this.boots.create(this.level.bonuses.speed[i].x,this.level.bonuses.speed[i].y,'boots');
					}
				}
		},
		launchSpeedBonus: function(player,boots){
				boots.destroy();
				this.add.tween(player).from({speed: 2*player.speed},4000,"Linear",true);
				
		}
						
				
					
			
			
			
};
