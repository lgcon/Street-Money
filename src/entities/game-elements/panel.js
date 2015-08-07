/* This function build and return a board used to display informations or menus
* @param: x,y the position of the board (the center);
* @param: h,w the dimensions of the board (heigth and width);
* @return: a Phaser.Group having as children all the elements of the board
*/
Phaser.Game.prototype.createBoard = function (x,y,h,w){
		var board = this.add.group();
		board.buttons = this.add.group();
		board.fixedToCamera = true;
		board.visible = false;
		board.panel = this.make.image(x,y,'panel');
		board.panel.anchor.setTo(0.5,0.5);
		if (h) board.panel.height = h;
		if (w) board.panel.width = w;
		board.label = this.make.image(x,board.panel.top,'level_label');
		board.label.anchor.setTo(0.5);
		board.label.text = this.make.text(board.label.x,board.label.y,'',{font: this.textFont, fill: '#E86A17', fontSize: 100});
		board.label.text.anchor.setTo(0.5);
		board.setTitle = setTitleBoard;	
		board.addMultiple([board.panel,board.label,board.label.text]);	
		return board;
}
/*Insert a text containg the title in the label of the board
* @param: title (string)
*/
function setTitleBoard(title){
		this.label.text.text = title;
		this.label.width = this.label.text.width+50;
}
		
