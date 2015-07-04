
// Enumaration of the 4 basical directions TODO use enumeration by Phaser
var direction = {up: 0, down:1, right: 2, left: 3};

// Return a string with the direction from an enumeration
function getDirectionString(dir){
	switch (dir){
		case direction.up:
			return "up";
		case direction.down:
			return "down";
		case direction.right:
			return "right";
		case direction.left:
			return "left";
	}
}
		

/*This function take one angle as argument and returns one direction between up,down,right and left based on a interval of PI/2
* @param: An angle in radiant
* @return: One direction between up,down,right and left (enumarated)
*/
function fromAngleToDirection(angle){//TODO make it more performant
	var step = Math.PI/4;
	if (angle < -step && angle > -step*3)
		return direction.up;
	else if (angle > step && angle < step*3)
		return direction.down;
	else if (angle > -step && angle < step)
		return direction.right;
	else
		return direction.left;
}

