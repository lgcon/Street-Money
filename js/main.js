//Create a Phaser.Game object
var game = new Phaser.Game(937,532,Phaser.Auto,'');
//Let's add the all the states we created before
game.state.add('Boot',boot);
game.state.add('Load',load);
game.state.add('Menu',menu);

//Add all the levels
var totalLevels = 1;
for ( var i = 0; i < totalLevels; i++){
	game.state.add('Level'+i,levels[i]);
}
//We launch the 'Boot' state
game.state.start('Boot');
