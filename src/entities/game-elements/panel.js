/* This function build and return a board used to display informations or menus
* @param: x,y the position of the board (the center);
* @param: h,w the dimensions of the board (heigth and width);
* @return: a Phaser.Group having as children all the elements of the board
*/
function createBoard(x,y,h,w){
		var board = this.make.group();
		board.panel = this.make.image(x,y,'panel');
		board.panel.anchor.setTo(0.5,0.5);
		board.panel.height = h;
		board.panel.width = w;
		board.label = this.make.image(x,board.panel.top,'level_label');
		board.label.anchor.setTo(0.5);
		board.setTitle = setTitleBoard;	
		board.addMultiple([board.panel,board.label]);
		return board;
}
/*Insert a text containg the title in the label of the board
* @param: title (string)
*/
function setTitleBoard(title){
		this.label.text = this.game.make.text(this.label.x,this.label.y,title,
						{font: this.game.textFont, fill: '#E86A17', fontSize: 80});
		this.label.text.anchor.setTo(0.5);
		this.label.width = this.label.text.width+50;
		this.add(this.label.text);
}
		