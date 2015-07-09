play.createHitButton = function(x,y){
		var button = this.add.button(x,y,'hitButton',play.treasures.hit);
		button.anchor.setTo(0.5,0.5);
		button.fixedToCamera = true;
		button.text = this.add.text(button.x,button.y,this.game.lang.hit_button,{font: this.game.textFont, fill: "#FBEFEF",
												fontSize: 55});
		button.text.anchor.setTo(0.5,0.5);
		button.text.fixedToCamera = true;
		button.onInputDown.add(function() { button.text.fill = "#FFFF00";});
		button.onInputUp.add(function() { button.text.fill = "#FBEFEF";});
		return button;
	}
