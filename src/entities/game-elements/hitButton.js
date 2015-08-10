play.createHitButton = function(x,y){
		var button = this.add.button(x,y,'hitButton',play.treasures.hit);
		button.anchor.setTo(0.5,0.5);
		button.fixedToCamera = true;
		button.text = this.add.text(button.x,button.y,this.game.lang.hit_button,
			{font: this.game.textFont, fill: game.textstyle.hit_button.color.released, fontSize: game.textstyle.hit_button.size});
		button.text.anchor.setTo(0.5,0.5);
		button.text.fixedToCamera = true;
		button.onInputDown.add(function() { button.text.fill = game.textstyle.hit_button.color.pressed;});
		button.onInputUp.add(function() { button.text.fill = game.textstyle.hit_button.color.released;});
		return button;
	}
