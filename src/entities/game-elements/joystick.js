play.createJoystick = function (x,y,r) {
		var direction = ['left','up','right','down'];
		var joystick =	{}; 
		for (var i = 0; i < 4; i++){
			var button = this.add.button(x-r,y,'joystick');
			button.anchor.setTo(0.5,0.5);
			button.position.rotate(x,y,Math.PI*i/2,false,r);
			button.rotation = Math.PI*i/2;
			button.fixedToCamera = true;
			button.inputEnabled = true;
			//TODO FIX: when button get down because of the event 'onInputOver' it doesnt go up when 'onInputUp'
			// Istead use something linked to button.input or the pointer
			button.onInputDown.add(function(){this.isDown = true;},button);
			button.onInputOver.add(isPointerDown,button,button);
			button.onInputUp.add(function(){this.isDown = false;},button);
			button.onInputOut.add(function(){this.isDown = false;},button);
			joystick[direction[i]] = button;
		}
		joystick.resetFrames = resetFrames;
		return joystick;
}

function isPointerDown(){
	if (game.input.activePointer.isDown){ //TODO check for problems whit the 'HIT' button
		this.isDown = true;
	}
}

function resetFrames(){
	for (button in this){
	     this[button].frame = 0;
	}
}
