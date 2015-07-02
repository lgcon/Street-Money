var menu = {
	create: function() {
		languageGame = JSON.parse(this.game.cache.getText('language'));
		//TODO: Create a menu (for now we pass directly to the next state)
		this.game.state.start('Play');
		}
};
