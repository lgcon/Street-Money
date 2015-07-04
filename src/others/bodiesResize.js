//This value will be the vertical dimension of the space occupied on the game surface
var feetHeight = 10;

/*Set the body shape according to the need of the game, to use with the sprites that need an isometric-style collision effect
* (it will move the body to the feet of the object and resize it) [! not valid for sprites belonging to groudObjects]
* take as parameter a Group or a Sprite, in the first case it will recursively look for all the sprite inside it
* @param: A Phaser.Group or another display object
*/
function setBodyAsFeet(object) {
	if (object instanceof Phaser.Group){
		for (var i = 0; i < object.length; i++)
			setBodyAsFeet(object.children[i]);
	}
	else 
		object.body.setSize(object.width/2,feetHeight,object.width/4,object.height-feetHeight);
}
