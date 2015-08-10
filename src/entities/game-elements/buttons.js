/* Add some functions to the Phaser.Button prototype */

Phaser.Button.prototype.goDown = function (soundKey){
					this.frame = 1;
					this.text.y += 5;
					if (this.game.soundOn && soundKey)
						this.game.sound.play(soundKey);
}

Phaser.Button.prototype.goUp = function (soundKey){
					this.frame = 0;
					this.text.y -= 5;
					if (this.game.soundOn && soundKey)
						this.game.sound.play(soundKey);
}


/*Create a text on the button referenced by the "text" property of the button (an instance of Phaser.Text), if existing change the content,
*@param: text, {string} thw text to write on the button
*/

Phaser.Button.prototype.setText = function (text){
					if (this.text)
						this.text.text = text;
					else{
						this.text = this.game.add.text(0,0, text, {font: game.textFont, 
											   fill: game.textstyle.buttons.color, 
											   fontSize: game.textstyle.buttons.size});
						this.addChild(this.text);
						this.text.anchor.setTo(0.5,0.5);
					}
}

/* This function build and returns a button 
* @param: x,y the position of the button (the center);
* @param: text, {string} the text to set on the button (optional);
* @param: setInputCallbcks, {bool} if true goDown and goUp will be set as callbacks;
* @param: downSound,upSound {string} the keys of the sound to play when the button moves up/down (optional);
* @return: a Phaser.Button
*/
Phaser.Game.prototype.createButton = function (x,y,text,setInputCallbacks,downSound,upSound){
					var button = this.add.button(x,y,'play_button');
					button.anchor.setTo(0.5,0.5);
					if (setInputCallbacks){
						button.onInputDown.add(function(){this.goDown(downSound);},button);
						button.onInputUp.add(function(){this.goUp(upSound);},button);
					}
					if (text)
						button.setText(text);
					return button;
}
	
					
