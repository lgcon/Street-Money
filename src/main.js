//TODO game will not longer be a global variable, need to fix all the broken link then (game -> this.game)
//Create a Phaser.Game object
var game = new Phaser.Game(1200,750,Phaser.AUTO,'game');
//Let's add the all the states we created before
game.state.add('Boot',boot);
game.state.add('Load',load);
game.state.add('Menu',menu);
game.state.add('Play',play);

//We launch the 'Boot' state
game.state.start('Boot');
