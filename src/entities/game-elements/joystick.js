play.createJoystick = function (x,y,r) {
		var directions = ['left','up','right','down'];
		var joystick =	{}; 
		for (var i = 0; i < 4; i++){
			var button = this.add.button(x-r,y,'joystick');
			button.anchor.setTo(0.5,0.5);
			//Create hit area
			var hitArea = new Phaser.Polygon([-button.width/2 ,    button.height/2,
							  -button.width/2 ,   -button.height/2,
							   button.width/2-75, -button.height/2,
							   button.width/2 ,    0,
							   button.width/2-75,  button.height/2
							]);
			button.hitArea = hitArea;
			//Calculate rotation
			button.position.rotate(x,y,Math.PI*i/2,false,r);
			button.rotation = Math.PI*i/2;
			button.fixedToCamera = true;
			//Inputs
			button.forceOut = true;
			button.onInputDown.add(function(){this.isDown = true;},button);
			button.onInputOver.add(function(button,pointer){
							/*We set the button as it would be down, this will make Phaser look for onUp events*/
							button.input._pointerData[pointer.id].isUp = false;
							button.input._pointerData[pointer.id].isDown = true;
							this.isDown = true;},button);
			button.onInputUp.add(function(button,pointer){
						/*We set the button as it would be out, this will make Phaser look for onOver events*/
						button.input._pointerData[pointer.id].isOut = true;
						button.input._pointerData[pointer.id].isOver = false;
						this.isDown = false;},button);
			button.onInputOut.add(function(){this.isDown = false;},button);
			button.alpha = 0.7;
			//Insert button into the joystick
			joystick[directions[i]] = button;
		}
		joystick.resetFrames = resetFrames;
		return joystick;
}

function resetFrames(){
	for (button in this){
	     this[button].frame = 0;
	}
}
