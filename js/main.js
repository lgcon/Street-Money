//Create a Phaser.Game object
var game = new Phaser.Game(937,532,Phaser.AUTO,'');

//Define global variables
var totalLevels = 1;
var currentLevel = 1;
var languageGame = null;
//Let's add the all the states we created before
game.state.add('Boot',boot);
game.state.add('Load',load);
game.state.add('Menu',menu);
game.state.add('Play',play);

//We launch the 'Boot' state
game.state.start('Boot');
