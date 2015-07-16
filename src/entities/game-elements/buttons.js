/* Add some functions to the Phaser.Button prototype */

Phaser.Button.prototype.goDown = function (soundKey){
					this.frame = 1;
					this.text.y += 3;
					if (this.game.soundOn && soundKey)
						this.game.sound.play(soundKey);
}

Phaser.Button.prototype.goUp = function (soundKey){
					this.frame = 0;
					this.text.y -= 3;
					if (this.game.soundOn && soundKey)
						this.game.sound.play(soundKey);
}
