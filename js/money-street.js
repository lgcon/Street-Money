/* money-street, version: 0.1.0, author: Luigi Coniglio */


/**
* When sorting recursively this array will be updated with the sprites to render 
*/

Phaser.Group.prototype.drawCache = [];

/**
* If set to true Phaser will be rendering the sprites cached in the 'drawCache' of this Group
* instead of considering the 'children'. When sorting this property is automatically set to true,
* in case of recursive sort, false otherwise
*/

Phaser.Group.prototype.renderDrawCache = false;

/**
* Recursive function that will stick all nested children sprites in the drawCache so they're on the same level
* 
* @method _recursiveCache
* @param children {Array} - The array where to search recursively for sprites to push in the drawCache
*/

Phaser.Group.prototype._recursiveCache = function (children) {

    for (var i = 0; i < children.length; i++) {
	
        if (children[i] instanceof Phaser.Group) {
            this._recursiveCache(children[i].children);
        }
        else {
            this.drawCache.push(children[i]);
        }
    }

};

/**
* Update this.drawCache getting all the sprites belonging to this Group and all the nested groups
*
* @method updateDrawCache
*/

Phaser.Group.prototype.updateDrawCache = function () {

    //clear the cache
    this.drawCache.length = 0;

    //cache all children
    this._recursiveCache(this.children);

};


/**
* Renders the Group using the WebGL renderer
*
* @method _renderWebGL
* @param renderSession {RenderSession}
* @private
*/

Phaser.Group.prototype._renderWebGL = function(renderSession)
{
    if(!this.visible || this.alpha <= 0)return;

    if(this._cacheAsBitmap)
    {
        this._renderCachedSprite(renderSession);
        return;
    }

    var i;
    var objectsToRender;

    if (this.renderDrawCache)
	// render the drawCache
	objectsToRender = this.drawCache;
    else
	// simply render the children!
	objectsToRender = this.children;

    if(this._mask || this._filters)
    {
        if(this._mask)
        {
            renderSession.spriteBatch.stop();
            renderSession.maskManager.pushMask(this.mask, renderSession);
            renderSession.spriteBatch.start();
        }

        if(this._filters)
        {
            renderSession.spriteBatch.flush();
            renderSession.filterManager.pushFilter(this._filterBlock);
        }

		
        for (i = 0; i < objectsToRender.length; i++) {
                objectsToRender[i]._renderWebGL(renderSession);
         }

        renderSession.spriteBatch.stop();

        if(this._filters)renderSession.filterManager.popFilter();
        if(this._mask)renderSession.maskManager.popMask(renderSession);

        renderSession.spriteBatch.start();
    }
    else
    {
	for (i = 0; i < objectsToRender.length; i++) {
                objectsToRender[i]._renderWebGL(renderSession);
        }
    }
};


/**
* Renders the Group using the Canvas renderer
*
* @method _renderCanvas
* @param renderSession {RenderSession} 
* @private
*/

Phaser.Group.prototype._renderCanvas = function(renderSession)
{
    if (this.visible === false || this.alpha === 0) return;

    if (this._cacheAsBitmap)
    {
        this._renderCachedSprite(renderSession);
        return;
    }

    if (this._mask)
    {
        renderSession.maskManager.pushMask(this._mask, renderSession);
    }
    
    var objectsToRender;

    if (this.renderDrawCache)
	// render the drawCache
	objectsToRender = this.drawCache;
    else
	// simply render the children
	objectsToRender = this.children;

    for (var i = 0; i < objectsToRender.length; i++)
    {
        objectsToRender[i]._renderCanvas(renderSession);
    }

    if (this._mask)
    {
        renderSession.maskManager.popMask(renderSession);
    }
};


/**
* Sort the children in the group according to a particular key and ordering.
*
* Call this function to sort the group according to a particular key value and order.
* For example to depth sort Sprites for Zelda-style game you might call `group.sort('y', Phaser.Group.SORT_ASCENDING)` at the bottom of your `State.update()`.
*
* @method Phaser.Group#sort
* @param {string} [key='z'] - The name of the property to sort on. Defaults to the objects z-depth value.
* @param {integer} [order=Phaser.Group.SORT_ASCENDING] - Order ascending ({@link Phaser.Group.SORT_ASCENDING SORT_ASCENDING}) or descending ({@link Phaser.Group.SORT_DESCENDING SORT_DESCENDING}).
* @param {boolean} - If true get recursively the objects from all nested groups and sort them before rendering.
*/

Phaser.Group.prototype.sort = function (index, order, recursive) {
    
    if (this.children.length < 2) {
        //  Nothing to swap
        return;
    }

    if (typeof index === 'undefined') { index = 'z'; }
    if (typeof order === 'undefined') { order = Phaser.Group.SORT_ASCENDING; }

    this._sortProperty = index;

    // determine the array to sort
    var arrToSort;
    if (recursive) {

        // cache all children
        this.updateDrawCache();
	this.renderDrawCache = true;
        arrToSort = this.drawCache;
    }
    else {
	if (this.renderDrawCache) { this.renderDrawCache = false };
        arrToSort = this.children;
    }

    // sort the appropriate array in the appropriate way
    if (order === Phaser.Group.SORT_ASCENDING) {
        arrToSort.sort(this.ascendingSortHandler.bind(this));
    }
    else {
        arrToSort.sort(this.descendingSortHandler.bind(this));
    }

    this.updateZ();

};

//Create the boot state
var boot = {
	init: function(){
			//First of all, resize the game and make it responsive
			this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
			this.scale.setMinMax(200,100,1200,750);	
			this.scale.pageAlignHorizontally = true;
			this.scale.setResizeCallback(this.onResizeCallback,this);
		
			if (!this.game.device.desktop){
				this.scale.forceOrientation(true, false);
				this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
	    	    this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
			}
		},
	onResizeCallback: function(){
			var scale = Math.min(window.innerWidth / this.game.width, window.innerHeight / this.game.height);
			this.scale.setUserScale(scale,scale,0,0);
		
		},
	enterIncorrectOrientation: function(){
			 document.getElementById('orientation').style.display = 'block';
			 document.getElementById('game').style.display = 'none';
			 this.game.paused = true;
		},
	leaveIncorrectOrientation: function(){
			 document.getElementById('orientation').style.display = 'none';
			 document.getElementById('game').style.display = 'block';
			 this.game.paused = false;
		},
	preload: function(){
			//Load game configuration
			this.load.text('conf','./config.json');
			//We load the image for the loading bar
			this.load.image('preloadbar','assets/images/preloader-bar.png');
			//And the image to ask for landscape
			this.load.image('rotatescreen','assets/images/rotatescreen.png');
			//Set physic system	
			this.physics.startSystem(Phaser.Physics.ARCADE);
			//Turn on sounds
			this.game.soundOn = true;
		},
	create: function(){
			this.game.input.maxPointers = 2;
			//Parse game configuration file
			game.conf = JSON.parse(this.game.cache.getText('conf')); 	
			//Some easier path
			game.textFont = game.conf.textfont.name;
			game.textstyle = game.conf.text_styles;
			if (!localStorage.lastUnblockedLevel)
				localStorage.setItem('lastUnblockedLevel',1);
			game.current_lev = parseInt(localStorage.lastUnblockedLevel);
			//Load google web fonts
			WebFont.load({
				google: {
					families: [game.conf.textfont.family]
				},
				active: function(){
					//Change state when complete (make sure the font has loaded)
					game.state.start('Load');
				}
			}); 
		}
};


//Create the game state load
var load = {	
		preload: function() {
				//Loading screen
				this.preloadBar = this.add.image(180,this.world.centerY,'preloadbar');
				this.preloadBar.scale.setTo(17,7);
				this.load.setPreloadSprite(this.preloadBar);
				var style = {font: game.textFont, fill: game.textstyle.loading.color, fontSize: game.textstyle.loading.size};
				this.add.text(this.world.centerX,this.preloadBar.y-80,'Loading...',style)
					.anchor.setTo(0.5,0.5);


				//Load assets
				//Menu
				this.load.image('menu_title','assets/images/menu_title.png');	
				this.load.spritesheet('coin_menu','assets/images/coin_menu.png',100,100);	
				this.load.image('arrow_left','assets/images/arrow_left.png');
				this.load.image('arrow_right','assets/images/arrow_right.png');
				this.load.image('lock','assets/images/lock.png');
				//Language
				this.load.text('language','assets/languages/'+game.conf.lang+'.json');



				//UI
				this.load.image('panel','assets/images/panel.png');
			 	this.load.image('level_label','assets/images/level_label.png');
				this.load.spritesheet('button','assets/images/button.png',293,112.5);
				this.load.spritesheet('speaker','assets/images/speaker.png',60,60);
				this.load.image('pause_button','assets/images/pause_button.png');
				this.load.spritesheet('star','assets/images/star.png',95,97);
				//Player
				this.load.spritesheet('player','assets/images/player.png',64,96);
				//Background
				this.load.image('city','assets/images/city.png');
				//Joystick
				this.load.spritesheet('joystick','assets/images/joystick.png',180,144);
				this.load.image('hitButton','assets/images/hitButton.png');

				//Money
				this.load.spritesheet('coin','assets/images/coin.png',64,64);
				//Bonuses
				this.load.image('boots','assets/images/boots.png');
				this.load.image('oil','assets/images/oil_spot.png');
				this.load.image('drain','assets/images/drain.png');
				//Robber
				this.load.spritesheet('robber','assets/images/robber.png',64,96);
				//Treasure
				this.load.spritesheet('treasure','assets/images/treasure.png',64,96);
				//Load the levels TODO load singularly at every call
				for(var i = 1; i < game.conf.total_levels+1;i++){
					this.load.text('level'+i,'assets/levels/level'+i+'.json');
				}
				//Sounds
				this.load.audio('click_sound',['assets/sounds/click.ogg','assets/sounds/click.wma','assets/sounds/click.mp3']);
				this.load.audio('music',['assets/sounds/music.ogg','assets/sounds/music.wma','assets/sounds/music.mp3'],true);
				this.load.audio('coin_sound',['assets/sounds/coin.ogg','assets/sounds/coin.wma','assets/sounds/coin.mp3']);
				this.load.audio('thief_sound',['assets/sounds/thief.ogg','assets/sounds/thief.wma','assets/sounds/thief.mp3']);
				this.load.audio('hit_sound',['assets/sounds/hit.ogg','assets/sounds/hit.wma','assets/sounds/hit.mp3']);
				this.load.audio('break_sound',['assets/sounds/break.ogg','assets/sounds/break.wma','assets/sounds/break.mp3']);
				this.load.audio('drain_sound',['assets/sounds/drain.ogg','assets/sounds/drain.wma','assets/sounds/drain.mp3']);
				this.load.audio('oil_sound',['assets/sounds/oil.ogg','assets/sounds/oil.wma','assets/sounds/oil.mp3']);
				this.load.audio('win_sound',['assets/sounds/win.ogg','assets/sounds/win.wma','assets/sounds/win.mp3']);
				this.load.audio('gameover_sound',['assets/sounds/gameover.ogg','assets/sounds/gameover.wma','assets/sounds/gameover.mp3']);
				this.load.audio('bad_sound',['assets/sounds/bad.ogg','assets/sounds/bad.wma','assets/sounds/bad.mp3']);
				this.load.audio('beep_sound',['assets/sounds/beep.ogg','assets/sounds/beep.wma','assets/sounds/beep.mp3']);
				//Switch state
				this.load.onLoadComplete.add(function(){
					this.game.music = this.add.audio('music',1,true);
					this.game.music.play();
					this.game.state.start('Menu');
					},this);
			}
};
						

var menu = {
	init: function(){ 
			this.world.width = this.game.width;//Restore the width of the world
	},
	preload: function() {
			this.game.lang = JSON.parse(this.game.cache.getText('language'));
		},
	create: function() {
			if (this.game.background){//If the background has been created in the past
				this.add.existing(this.game.background);
				this.game.background.width = this.world.width;
			}
			else{
				this.game.background = this.add.tileSprite(0,0,this.world.width,this.world.height,'city');
				this.game.background.alpha = 0.5;
			}
			var centerX = this.world.centerX;
			var centerY = this.world.centerY;
			//Title
			this.add.image(centerX, 100, 'menu_title')
				.anchor.setTo(0.5,0.5);
			this.coin = this.add.image(278,58,'coin_menu',4);
			this.coin.animations.add('flip',[5,6,7,0,1,2,3,4],10);
			this.timer = this.time.create();
			this.timer.loop(1500,this.coin.animations.play,this.coin.animations,'flip');
			this.timer.start();
			
			//Level selector
			//Level
			this.textLevel = this.add.text(centerX,centerY+50,game.current_lev,
			    {font:game.textFont, fill: game.textstyle.menu.level_number.color,fontSize: game.textstyle.menu.level_number.size});
			this.textLevel.anchor.setTo(0.5,0.5);
			//Text
			this.add.text(centerX,this.textLevel.y-150,game.lang.level_selector,
			       	{font:game.textFont, fill: game.textstyle.menu.maintext.color, fontSize: game.textstyle.menu.maintext.size})
				.anchor.setTo(0.5,0.5);
			//Lock
			this.lock = this.add.image(this.textLevel.x,this.textLevel.y,'lock');
			this.lock.anchor.setTo(0.5,0.5);
			this.lock.visible = false;
			//Arrows
			var distanceArrows = 150;
			this.arrowLeft = this.add.image(centerX-distanceArrows,this.textLevel.y,'arrow_left');
			this.arrowLeft.anchor.setTo(0.5,0.5);
			this.arrowLeft.inputEnabled = true;
			this.arrowLeft.events.onInputDown.add(function(){this.updateLevel(-1);},this);
			this.arrowRight = this.add.image(centerX+distanceArrows,this.textLevel.y,'arrow_right');
			this.arrowRight.anchor.setTo(0.5,0.5);
			this.arrowRight.inputEnabled = true;
			this.arrowRight.events.onInputDown.add(function(){this.updateLevel(1);},this);
			//Play button
			this.playButton = this.game.createButton(centerX,centerY+250,game.lang.play_button,false);
			this.playButton.onInputDown.add(function(){
								if (!this.textLevel.locked)
									this.playButton.goDown('click_sound');
								else
									this.playButton.goDown('bad_sound');
							},this);
			this.playButton.onInputUp.add(function(){
								this.playButton.goUp();
								if (!this.textLevel.locked){
									this.state.start('Play-intro');
								}},this);

			//Sound
			if (this.game.speaker){
				this.add.existing(this.game.speaker);
				this.game.speaker.cameraOffset.y = this.game.conf.positions.speaker.y;//Bring it back to the original position
			}
			else{
				this.game.speaker = this.add.image(this.game.conf.positions.speaker.x,this.game.conf.positions.speaker.y,'speaker',0);
				this.game.speaker.scale.setTo(1.5,1.5);
				this.game.speaker.fixedToCamera = true;
				this.game.speaker.inputEnabled = true;
				this.game.speaker.events.onInputDown.add(this.switchSound,this);
			}

			//Fullscreen
			this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
			this.input.onDown.add(this.goFullscreen,this);
		},
	shutdown: function (){
				//Keep the sprites we need for the next state
				this.world.remove(this.game.speaker);
				this.world.remove(this.game.background);
	},
	updateLevel: function (step){
			var newLevel = game.current_lev + step;
			if (newLevel < 1 || newLevel > game.conf.total_levels){
				this.game.playsound('bad_sound');
				return;
			}
			game.current_lev = newLevel;
			this.game.playsound('click_sound');
			if (newLevel > localStorage.lastUnblockedLevel){
				if (!this.textLevel.locked){//lock the level
					this.textLevel.fill = '#BDBDBD';
					this.textLevel.alpha = 0.3;
					this.lock.visible = true;
					this.textLevel.locked = true;
				}	
			
			}
			else {
				if (this.textLevel.locked){//unlock the level
					this.textLevel.fill = '#FBEFEF';
					this.textLevel.alpha = 1;
					this.lock.visible = false;
					this.textLevel.locked = false;
				}
			}
			this.textLevel.setText(game.current_lev);
		},
	switchSound: function() {
			this.sound.play('click_sound');
			if (this.game.speaker.frame == 0){
				this.game.speaker.frame = 1;
				this.game.speaker.alpha = 0.7;
				this.game.soundOn = false;
				this.game.music.stop();				
			}
			else {
				this.game.speaker.frame = 0;
				this.game.speaker.alpha = 1;
				this.game.soundOn = true;
				this.game.music.play();
			}
		},
	goFullscreen: function(){
			this.scale.startFullScreen();
	}

};

var play_intro = {	
			init: function(){
				this.world.width = this.game.width;//restore the width of the world
				//parse the level
				play.level = JSON.parse(this.game.cache.getText('level'+this.game.current_lev));	
			},
			create: function(){
				this.add.existing(this.game.background);
				this.add.existing(this.game.speaker);
				this.game.speaker.cameraOffset.y = this.game.conf.positions.speaker.y;//bring it back to the original position
				//we build the board
				this.board = this.game.createBoard(this.world.centerX,this.world.centerY);
				this.board.visible = true;//show the board
				this.board.fixedToCamera = false;//dont need it
				this.board.label.y += 60;//adjust the position of the label...
				this.board.label.text.y += 60;//..and the text inside it
				this.board.setTitle(this.game.lang.level+' '+this.game.current_lev);
				//text style
				this.textStyle = {font: game.textFont, 
						  fill: game.textstyle.panels.content.color, 
						  fontSize: game.textstyle.panels.content.size};
				//button
				this.board.button = this.game.createButton(this.board.panel.x,this.board.panel.y+250,'',true,'click_sound');
				this.board.add(this.board.button);
				//if the level has a tutorial, show the tutorial, otherwise go to the info direclty
				if (play.level.tuto && this.game.lang.tutos[this.game.current_lev])
					this.showTuto();
				else
					this.showInfos();
			},
			shutdown: function(){
				//keep the sprites we need for the next state
				this.world.remove(this.game.speaker);
				this.world.remove(this.game.background);
			},
			showTuto: function (){
				this.hasTuto = true;
				var tuto = this.game.lang.tutos[this.game.current_lev];
				this.tutoTitle = this.add.text(this.board.label.x,this.board.label.y+100,tuto.title,this.textStyle);
				this.tutoImg = this.add.image(this.board.panel.x, this.tutoTitle.y+80, 
							      play.level.tuto.image, play.level.tuto.frame);
				this.tutoTxt = this.add.text(this.board.panel.x,this.tutoImg.y+60,tuto.text,this.textStyle);
				this.board.button.setText(this.game.lang.tutos.button);
				this.tutoElements = this.add.group();
				this.tutoElements.addMultiple([this.tutoTitle,this.tutoImg,this.tutoTxt]);
				this.tutoElements.setAll('anchor.x',0.5);
				this.board.addMultiple([this.tutoElements]);
				this.add.tween(this.board).from({y: -720},300,'Linear').start();
				this.board.button.onInputUp.add(function(){this.showInfos();},this);
			},
			showInfos: function(){
				//Clear the board if there was a tuto before
				if (this.hasTuto){
					this.tutoElements.destroy();
				}
				this.infos = this.add.text(this.board.panel.x,this.board.panel.y-80,this.game.lang.text_goal+' '+play.level.goal
								+'\n'+this.game.lang.text_time+' '+play.level.time+'s',this.textStyle);
				this.infos.anchor.setTo(0.5);
				this.text_preLevel = this.add.text(this.board.panel.x,this.board.panel.y+100,
								   this.game.lang.text_preLevel,this.textStyle);
				this.text_preLevel.anchor.setTo(0.5);
				this.board.button.setText(this.game.lang.start_button);
				this.board.button.onInputUp.add(function(){this.state.start('Play');},this);
				this.board.addMultiple([this.infos,this.text_preLevel]);
				//If this is the first time we see the board (there is no tuto) we set a tween
				if (!this.hasTuto)
					this.add.tween(this.board).from({y: -720},300,'Linear').start();
			}
}

//Create some variablesto identify sprites and groups
var cursors;
//Play state
var play = {	
		preload: function(){
			//Define world bounds
			this.world.setBounds(0,0,this.level.width,750);
			//STREET BOUDARIES (this array must contain all the sprites that risk to go out of the street and need to stay inside)
			//!!ATTENTION!! in order to deal with different height of sprites the anchor has to be set on the bottom
			this.keepInTheStreet = [];
		},
		create: function(){
			//Background
			this.add.existing(this.game.background);
			this.game.background.width = this.world.width;
			this.game.background.alpha = 1;
			//GAME ENTITIES
			this.player = this.createPlayer();				
			this.coins = this.createCoins();	
			this.robbers = this.createRobbers();
			this.treasures = this.createTreasures();
			this.drains = this.createDrains();
			this.oilSpots = this.createOilSpots();
			this.boots = this.createBoots();
			
			//PATH-FOLLLOWERS PROPERTIES
			var pathBasedPersonages = [this.robbers,this.treasures];
			this.path.setProperties(pathBasedPersonages);

			//SITHJESTER's ANIMATIONS (spritesheets from sithjester uses the same animations, we can add them together)
			var sithJestersSprites = [this.robbers,this.treasures];
			for (i = 0; i < sithJestersSprites.length; i++){
				sithJestersSprites[i].callAll('animations.add','animations','down',[0,1,2,3],10,true);
				sithJestersSprites[i].callAll('animations.add','animations','left',[4,5,6,7],10,true);
				sithJestersSprites[i].callAll('animations.add','animations','right',[8,9,10,11],10,true);
				sithJestersSprites[i].callAll('animations.add','animations','up',[12,13,14,15],10,true);	
			}
		

			//MAKE EVERYTHING ISOMETRIC
			this.groundObjects = this.add.group();
			this.groundObjects.addMultiple([this.oilSpots,this.drains]);
			this.entitiesToSort = this.add.group();
			this.entitiesToSort.addMultiple([this.player,this.robbers,this.treasures,this.boots,this.coins]);
			//No need to change the 'z' index of the children of the world, they are already ordered	

			//CONTROLS	
			if (this.game.device.desktop) {
				cursors = this.input.keyboard.createCursorKeys();
				this.spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
				this.spacebar.onDown.add(this.treasures.hit);
				this.buttonsToPause = [];
			} else {
				var bottomAreaHeight = 393;
				//Adapt for mobile devices (commands should be on the bottom)
				//Create the space for the controls
				this.street = this.add.group();
				this.street.addMultiple([this.game.background,this.groundObjects,this.entitiesToSort]);
				this.street.y -= bottomAreaHeight;
				//Create touch controls
				this.hitButton = this.createHitButton(this.game.conf.positions.hitButton.x,
								      this.game.conf.positions.hitButton.y);
				this.joystick = this.createJoystick(this.game.conf.positions.joystick.x,
								    this.game.conf.positions.joystick.y,
								    this.game.conf.positions.joystick.radius);
				this.buttonsToPause = [this.joystick.up,this.joystick.down,this.joystick.right,this.joystick.left,
							this.hitButton];
			}

			//GAME TEXT 
			var centerX = this.game.width/2;
			this.textStyle = {font: game.textFont, fill: game.textstyle.gameinfo.color, fontSize: game.textstyle.gameinfo.size};
			//SCORE
			this.score = 0;
			var scorePosition = this.game.conf.positions.text_score;
			this.coinsleftText = this.add.text(scorePosition.x,scorePosition.y,this.game.lang.text_score,this.textStyle);
			this.coinsleftText.count = this.add.text(this.coinsleftText.right+20,this.coinsleftText.y,play.level.goal,
								 this.textStyle);
			this.coinsleftText.fixedToCamera = true;
			this.coinsleftText.count.fixedToCamera = true;

			//TIMER
			this.timer = this.createTimer();
			this.timer.start();
			//Display
			var textPosition = this.game.conf.positions.text_timeleft;
			this.timer.text = this.add.text(textPosition.x,textPosition.y,this.game.lang.text_timer,this.textStyle);
			this.timer.text.count = this.add.text(this.timer.text.right+20,this.timer.text.y,this.timer.left,this.textStyle);
			this.timer.text.fixedToCamera = true;
			this.timer.text.count.fixedToCamera = true;
			//CAMERA
			this.camera.follow(this.player);
			
			//Buttons
			this.add.existing(this.game.speaker);
			this.pauseButton = this.add.button(this.game.conf.positions.pauseButton.x,
							   this.game.conf.positions.pauseButton.y,'pause_button');
			this.pauseButton.scale.setTo(1.5,1.5);
			this.pauseButton.fixedToCamera = true;
			this.pauseButton.onInputDown.add(this.startPause,this);
			this.buttonsToPause.push(this.pauseButton);	

			//Reposition (for mobile)
			if (!this.game.device.desktop){
				this.coinsleftText.cameraOffset.y += this.world.height - bottomAreaHeight;
				this.coinsleftText.count.cameraOffset.y += this.world.height - bottomAreaHeight;
				this.timer.text.cameraOffset.y += this.world.height - bottomAreaHeight;
				this.timer.text.count.cameraOffset.y += this.world.height - bottomAreaHeight;
				this.pauseButton.cameraOffset.y += this.world.height - bottomAreaHeight;
				this.game.speaker.cameraOffset.y = this.game.conf.positions.speaker.y + this.world.height - bottomAreaHeight;
			}

			//BOARD & Panels
			this.board = this.game.createBoard(centerX,400,550,550);
			var styleTextButtons = {font: this.game.textFont, fill: "#FBEFEF", fontSize: 60};//TODO use a global var
			//Restart button	
			this.restartButton = this.game.createButton(this.board.panel.x,this.board.panel.y-105,
								    this.game.lang.restart_button,true,'click_sound');
			this.restartButton.onInputUp.add(function(){this.game.state.start('Play-intro');},this);
			//Menu button
			this.menuButton = this.game.createButton(this.board.panel.x,this.board.panel.y+35,
								 this.game.lang.menu_button,true,'click_sound');
			this.menuButton.onInputUp.add(function(){this.game.state.start('Menu')},this);
			//Resume button
			this.resumeButton = this.game.createButton(this.board.panel.x,this.board.panel.y+175,
								   this.game.lang.resume_button,true,'click_sound');
			this.resumeButton.onInputUp.add(this.stopPause,this);
			//Next Level button
			this.nextlevelButton = this.game.createButton(centerX+170,500,this.game.lang.goNextLevel_button,false);
			this.nextlevelButton.onInputDown.add(function(){
								if (this.game.current_lev >= this.game.conf.total_levels)
									this.nextlevelButton.goDown('bad_sound');
								else
									this.nextlevelButton.goDown('click_sound');
							     },this);
			this.nextlevelButton.onInputUp.add(function(){this.nextlevelButton.goUp();this.startNextLevel();},this);
			//Lets use a group to definei some common properties to the buttons
			this.board.buttons.addMultiple([this.restartButton,this.menuButton,this.resumeButton,this.nextlevelButton]);	
			this.board.buttons.setAllChildren('visible',false);
			this.board.buttons.fixedToCamera = true;
			
			//Menus
			this.pauseMenu = [this.restartButton,this.menuButton,this.resumeButton];
			this.gameoverMenu = [this.restartButton,this.menuButton];
			this.levelpassedMenu = [this.restartButton,this.nextlevelButton];

			//RESIZE BODIES
			setBodyAsFeet(this.entitiesToSort);
			var sprite;
			for (i = 0; i < this.drains.length; i++){
				sprite = this.drains.children[i];
				sprite.body.setSize(10,10,sprite.width/2-5,sprite.height/2-5);
			}
			for (i = 0; i < this.oilSpots.length; i++){
				sprite = this.oilSpots.children[i];
				sprite.body.setSize(sprite.width/2,sprite.height/2,sprite.width/4,sprite.height/4);
			}
			//PAUSE
			//Generate a subWorld to stop in order to separate the game from the pause
			this.elementsToPause = this.world.createSubGroup();
			//Move out of the subWorld the elements that shouldn't be paused
			this.world.addMultiple([this.game.speaker,this.board,this.board.buttons]);
			
		},
		update: function(){
			this.player.move();
			//Check for street's up bound
			this.keepInTheStreet.forEach(function(sprite){if (sprite.y < 505) 
										sprite.y = 505;
								      else if (sprite.y > this.game.height)
										sprite.y = this.game.height},this);
			//Move the treasures
			for (i = 0; i < this.treasures.children.length;i++)
				this.path.updateDirection(this.treasures.children[i]);
			//COLLISIONS/OVERLAPS
			this.physics.arcade.overlap(this.player,this.coins,this.coins.collect);
			this.physics.arcade.overlap(this.player,this.boots,this.boots.getBonus);
			if (!this.physics.arcade.overlap(this.player,this.oilSpots,this.oilSpots.slip))
				this.player.allowSlip = true;//In order to avoid multiple splip events
			//Check for ovelap with drains
		 	if (!this.physics.arcade.overlap(this.player,this.drains,this.drains.teleport) && this.player.exists)
				this.player.allowTeleport = true; //If the player is out of any drain, allow teleporting for eventual contacts
			//Check for collision with the robber
			this.physics.arcade.collide(this.player,this.robbers,this.robbers.steal);
			//Check for collisions with the treasures
			this.physics.arcade.collide(this.player,this.treasures);
			//Update display order
			this.entitiesToSort.sort('bottom',Phaser.Group.SORT_ASCENDING,true);
		},
		render: function(){
//			this.time.advancedTiming = true;
//			this.game.debug.text('fps: '+this.time.fps,200,32);
//			this.game.debug.body(this.player);
//			this.robbers.forEach(this.game.debug.body,this.game.debug);
//			this.treasures.forEach(this.game.debug.body,this.game.debug);
//			this.boots.forEach(this.game.debug.body,this.game.debug);
//			this.coins.forEach(this.game.debug.body,this.game.debug);
//			this.drains.forEach(this.game.debug.body,this.game.debug);
//			this.oilSpots.forEach(this.game.debug.body,this.game.debug);
		},
		shutdown: function(){
			//Remove the object we need to use later
			this.world.remove(this.game.speaker);
			this.game.background.parent.removeChild(this.game.background);
			//Restore some values
			this.game.background.alpha = 0.5;	
			this.game.background.tint = 0xFFFFFF;
			if (!this.input.keyboard.enabled)//When in a pause state the keyboard is disabled
				this.input.keyboard.enabled = true;
		},
		startPause: function(){
			this.game.playsound('click_sound');
			//Show the menu
			this.board.visible = true;
			for (var i = 0; i < this.pauseMenu.length; i++)
				this.pauseMenu[i].visible = true;
			this.board.setTitle(game.lang.pause_menu);
			//Block game
			this.pauseGame();
		},
		stopPause: function(){
			this.board.visible = false;
			for (var i = 0; i < this.pauseMenu.length; i++)
				this.pauseMenu[i].visible = false;
			this.game.unsetPause([this.elementsToPause],[this.timer],this.buttonsToPause,true);
			this.elementsToPause.setAllChildren('tint',0xFFFFFF);
			if (this.game.renderType == Phaser.CANVAS)
					this.game.background.alpha = 1;
		},
		gameover: function(){
			//Restyle the panel
			this.board.panel.height = 400;
			this.board.label.text.fontSize = 80;
			this.board.label.y = this.board.panel.top;
			this.board.label.text.y = this.board.panel.top;
			this.board.buttons.cameraOffset.y += 70;
			//Play sound
			this.game.playsound('gameover_sound');
			//Show the menu
			this.board.visible = true;
			for (var i = 0; i < this.gameoverMenu.length; i++)
				this.gameoverMenu[i].visible = true;
			this.board.setTitle(game.lang.gameover_menu);
			//Block game
			this.pauseGame();
		},
		levelpassed: function(){
			//Block game
			this.pauseGame();
			//Update player results
			if (localStorage.lastUnblockedLevel < game.conf.total_levels)
				localStorage.lastUnblockedLevel++;
			//Play sound
			this.game.playsound('win_sound');
			//Text
			var textVictory = this.add.text(this.camera.x+this.game.width/2,200,this.game.lang.levelpassed,
				{font: game.textFont, fill: game.textstyle.levelpassed.color, fontSize: game.textstyle.levelpassed.size});
			textVictory.anchor.setTo(0.5);		
			//Stars
			var levelScore = this.timer.left/this.level.time;
			var stars = [];
			for (var i = 0; i < 3; i++){//Create 3 stars
				stars.push(this.add.image(textVictory.x-150+i*150,textVictory.y+120,'star',0));
				stars[i].anchor.setTo(0.5);
			}
			if (levelScore <= 0.3){//More than 70% of the time
				stars[2].frame = 1;
				if (levelScore <= 0.2)//More than 80% of the time
					stars[1].frame = 1;
			}
			//Buttons
			for (var i = 0; i < this.levelpassedMenu.length; i++)
				this.levelpassedMenu[i].visible = true;
			this.restartButton.x = this.nextlevelButton.x-340;
			this.restartButton.y = this.nextlevelButton.y;
			
			
			
		},
		startNextLevel: function() {
			if (this.game.current_lev >= this.game.conf.total_levels)
				return;
			this.game.current_lev++;
			this.state.start('Play-intro');
		},
		pauseGame: function(){
			//Stop everything
			this.game.setPause([this.elementsToPause],[this.timer],this.buttonsToPause,true);

			//ATTENTION: the canvas render mode create a problem when changing the tint of the timer	
			this.elementsToPause.setAllChildren('tint',0x1C1C1B); 
			if (this.game.renderType == Phaser.CANVAS) //Escamotage due to the issue of pixi relative at the tint of tilesprites
					this.game.background.alpha = 0.2;
		}
			
};

play.path = {
		setProperties:  function (entities) {
					for (var i = 0; i < entities.length; i++){
						entities[i].setAll('goingTo',0,false,false,0,true);//index of the point the sprite is moving to
						entities[i].setAll('direction',0,false,false,0,true);//The default direction is 0
						entities[i].setAll('waiting',false,false,false,0,true);//Start without waiting
					}
				},


		/*If a sprite in following a path this function has to be called each frame in order to update the direction
		 * @param: the sprite to move, the data of the sprite from the current level
		 * @result: update the velocity of the sprite
		 */
		updateDirection: function (sprite){
					//Check if the sprite reached the next point of the path and is not waiting
					if (play.path.arrived(sprite,sprite.data.path[sprite.goingTo]) && sprite.waiting == false){
						//If it has to wait set a timer
						if(sprite.data.path[sprite.goingTo].wait > 0){
							sprite.body.velocity.setTo(0,0);
							sprite.waiting = true;
							play.timer.add(sprite.data.path[sprite.goingTo].wait,this.goNext,play,sprite);
							sprite.animations.stop();
						}//Otherwise move to the next node
						else {
							this.goNext(sprite);
						}
						
							
					}
				},
		/*This function takes a sprite and the next node of his path and check if the node 
		* has been reached by the sprite taking into acoount the value of sprite.direction
		* @param: a Phaser.Sprite onbject (with .direction attribute added)
		*/ 
		arrived: function (sprite,node){
			switch (sprite.direction){
				case direction.up:
					return sprite.y <= node.y;
				case direction.down:
					return sprite.y >= node.y;
				case direction.right:
					return sprite.x >= node.x;
				case direction.left:
					return sprite.x <= node.x;
			}
		},
		

		/*If the sprite is following a path, this function will make it go to the next node
		* @param: The sprite to move, an object containing the path
		*/
		goNext: function(sprite){	
					/*First check if the body exist (this test was a fast solution to avoid the issue due to the asynchronus 					* call of this function (timer set to wait in a path node after the sprite has been destroyed)
					*/
					if (!sprite.body)
						return false;
					if (sprite.data.path[sprite.goingTo+1])//check if exist a next point in the path
						sprite.goingTo++;//in this case we move to it
					else
						sprite.goingTo = 0;//if not go to the first point of the path
	
					var angle = play.physics.arcade.moveToXY(sprite,sprite.data.path[sprite.goingTo].x,sprite.data.path[sprite.goingTo].y,sprite.data.speed);
					sprite.direction = fromAngleToDirection(angle);
					sprite.animations.play(getDirectionString(sprite.direction));
					sprite.waiting = false;
				}
};
			

play.createRobbers = function () {
			//ROBBERS
			var robbers = this.add.group();
			robbers.enableBody = true;
			for (var i = 0; i < this.level.personages.robbers.length; i++){
				robbers.create(this.level.personages.robbers[i].path[0].x,
						    this.level.personages.robbers[i].path[0].y,'robber');
				robbers.children[i].body.immovable = true;
				robbers.children[i].data = this.level.personages.robbers[i];
			}
			robbers.steal = stealCoin;
			robbers.update = updateRobbers;
			//Animations and path logic are in the main create method
			return robbers;
		}

/*This function is called when the player collide with a robber, takes out 1 from the score and display a -1 text
* @param: the sprite object of the player and the robber
*/ 
function stealCoin(player,robber){
		//Steal one coin max every 200ms and only if there are coins to steal
		if (play.time.elapsedSince(player.lastTheft) > 200 && play.score > 0){
			play.score--;
			player.game.playsound('thief_sound');
			player.lastTheft = play.time.time;
			play.coinsleftText.count.setText(play.level.goal-play.score);				
			//Display a -1 when a coin is stolen
			var oneLessWarn = play.add.text(player.x,player.top-100,"-1",{font: play.game.textFont, fill: "#FF0000", fontSize: 50});
			if (play.street) play.street.add(oneLessWarn);
			play.add.tween(oneLessWarn).from({y: player.y, alpha: 0},1000,Phaser.Easing.Linear.None,true)
						   .onComplete.add(oneLessWarn.destroy,oneLessWarn);
		}
}


function updateRobbers(){
		for (var i = 0; i < this.children.length; i++)
			play.path.updateDirection(this.children[i]);
}

play.createTreasures = function() { 
				var treasures = this.add.group();
				treasures.enableBody = true;
				for (i = 0; i < play.level.personages.treasures.length; i++){
					treasures.create(play.level.personages.treasures[i].path[0].x,
							      play.level.personages.treasures[i].path[0].y,'treasure');
					treasures.children[i].data = this.level.personages.treasures[i];
					treasures.children[i].body.immovable = true;
				}
				treasures.hit = hitTreasure;	
				treasures.breack = breackTreasure;
				return treasures;
}


/*This function reduce by 1 the life of every treasure distant less than 50px from the player, if the life is 0 the tresure is
* destroyed, and the money it contains are launched in every direction
* @param: none.
*/		
function hitTreasure(){
		for (var i = 0; i < play.treasures.length; i++){
			var treasure = play.treasures.children[i];
			//If the treasure is distant less than 50px from the player
			if (play.physics.arcade.distanceBetween(play.player,treasure) < 50){
				treasure.data.life--;
				game.playsound('hit_sound');
				if (treasure.data.life > 0){
					//Display the remaining life
					var lifeInfo = play.add.text(treasure.x,treasure.top-120,
							     treasure.data.life,{font: this.game.textFont, fill:"#FF8000", fontSize: 50});
					if (play.street) play.street.add(lifeInfo);
					play.add.tween(lifeInfo)
						.from({y: treasure.top,alpha: 0},500,Phaser.Easing.Linear.None,true)
						.onComplete.add(lifeInfo.destroy,lifeInfo);
				}
				else {	
					play.treasures.breack(treasure);	
				}
			}
		}
	}

//Launch all the coins and destroy the treasure	
function breackTreasure(treasure){
			this.game.playsound('break_sound');
			var velocityCoins = new Phaser.Point(500,0);
			var angleCoins = 2*Math.PI/treasure.data.coins;
			for (var i = 0; i < treasure.data.coins; i++){
				var coin = play.coins.create(treasure.x,treasure.y,'coin',0)
				coin.body.velocity.setTo(velocityCoins.x,velocityCoins.y);
				coin.body.collideWorldBounds = true;
				coin.anchor.setTo(0.5,1);
				coin.body.setSize(coin.width/2,feetHeight);
				play.keepInTheStreet.push(coin);
				play.add.tween(coin.body.velocity).to({x:0,y:0},1000,Phaser.Easing.Linear.None,true);
				coin.animations.add('spin',[0,1,2,3,4,5,6,7],10,true);
				coin.animations.play('spin');
				velocityCoins.rotate(0,0,angleCoins);
			}
			treasure.destroy();
}	

play.createBoots = function() {
			var boots = this.add.group();
			boots.enableBody = true; 
			boots.generate = generateBoots;
			boots.getBonus = launchSpeedBonus;
			return boots;
	} 



function generateBoots(){
		for ( var i = 0; i < play.level.objects.boots.length; i++){
			if (play.level.objects.boots[i].time === play.level.time - play.timer.left){
				var boots = play.boots.create(play.level.objects.boots[i].x,play.level.objects.boots[i].y,'boots');	
				boots.body.setSize(boots.width/2,feetHeight,boots.width/4,boots.height-feetHeight);
			}
		}
	}
function launchSpeedBonus(player,boots){
		boots.destroy();
		play.add.tween(player).from({speed: 2*player.speed},4000,"Linear",true);
		
}

play.createCoins = function () {
			//COINS
			var coins = this.add.group();
			coins.enableBody = true;
			//Create initial coins
			for (this.currentCoin = 0;this.currentCoin < this.level.startingCoins;this.currentCoin++){
				coins.create(this.level.coins[this.currentCoin].x,this.level.coins[this.currentCoin].y,'coin',0);
			}
			//Animate them
			coins.callAll('animations.add','animations','spin',[0,1,2,3,4,6,7],10,true);
			coins.callAll('animations.play','animations','spin');

			coins.collect = collectCoin;
			
			return coins;
	}

function collectCoin(player, coin){
			coin.destroy();
			//Calculate and show score
			play.score++;
			var coinsLeft = play.level.goal-play.score;
			play.coinsleftText.count.setText(play.level.goal-play.score);
			player.game.playsound('coin_sound');	
			//Add next coin
			if (play.currentCoin < play.level.coins.length){
				var newCoin = play.coins.create(play.level.coins[play.currentCoin].x,play.level.coins[play.currentCoin].y,'coin');
				newCoin.animations.add('spin',[0,1,2,3,4,5,6,7],10,true);
				newCoin.animations.play('spin');
				newCoin.body.setSize(newCoin.width/2,feetHeight,newCoin.width/4,newCoin.height-feetHeight);
				play.currentCoin++;
			}
			//Did the player win?
			if (coinsLeft <= 0)
				play.levelpassed();
				
		
	}

play.createDrains = function () { 
			var drains = this.add.group();
			drains.enableBody = true;
			for (i = 0; i < play.level.objects.drains.length; i++){
				drains.create(play.level.objects.drains[i].x,play.level.objects.drains[i].y,'drain')
					.go = play.level.objects.drains[i].go;
			}
			drains.teleport = teleport;
			drains.teleport.go = moveToNextDrain;
			return drains;
	}

/*This function permorms a teleport to the next drain
* @param: the player to teleport, the actual drain which body overlaped with the player
*/
function teleport(player, drain){
		//Teleport only if allowed
		if (player.allowTeleport){
			player.animation = 'fall';
			//We neew to check the value of isTeleporting in order to avoid add multiple timers
			if (player.isTeleporting){
				player.body.velocity.setTo(0,0);
			}
			else {
				player.isTeleporting = true;
				play.timer.add(500,this.go,this,player,drain);
				player.game.playsound('drain_sound');
			}
		}
	}
/*This function move the player to the next drain
* @param: the player to move, the drain from which the player is coming from
*/
function moveToNextDrain(player,drain){
			var nextDrain = play.drains.children[drain.go];
			//Free the camera from following the player
			play.camera.unfollow();
			//Take out the player from the game and move it to the next drain
			play.player.exists = false;
			player.position.setTo(nextDrain.x+nextDrain.width/2,nextDrain.y+nextDrain.height/2);
			//Set a tween to move smoothly the camera to the player
			play.add.tween(play.camera.view)
				.to({x: player.position.x - play.camera.view.halfWidth, 
				     y: player.position.y - play.camera.view.halfHeight},500)
				.start()
				.onComplete.add(function(){
							play.camera.follow(player);
							play.player.exists = true;},play);
											  
			//Don't allow teleport since the player exit the new drain
			player.allowTeleport = false;
			player.isTeleporting = false;
		}	

play.createOilSpots = function () {	
			var oilSpots = this.add.group();
			oilSpots.enableBody = true;
			for (var i = 0; i < play.level.objects.oil.length; i++)
				oilSpots.create(this.level.objects.oil[i].x,play.level.objects.oil[i].y,'oil');
			oilSpots.slip = slip;
			return oilSpots;
}


/*Called when the player overlap with an oil spot, make the player slip for 500ms in the direction he was going
* @param: the player, a reference to the spot ovelapped with the player
*/
function slip(player,spot){
	if (player.allowSlip){
		player.allowSlip = false;
		player.game.playsound('oil_sound');
		//Note, tween on the speed are possible because they are updated after the update function
		console.log(player.body.velocity.x);
		if (player.body.facing == Phaser.UP || player.body.facing == Phaser.DOWN)
			play.add.tween(player.body.velocity).to({y: 0},1500,"Linear",true);
		else
			play.add.tween(player.body.velocity).to({x: 0},1500,"Linear",true);	
	}
}	

/*Create and initialize the player
*/
play.createPlayer = function () {
			//PLAYER
			var player = this.add.sprite(this.level.playerStarts.x,this.level.playerStarts.y,'player',0);
			//Add physic body to the player
			this.physics.arcade.enable(player);
			//Walk animation
			player.animations.add('down',[0,1,2,3],10,true);
			player.animations.add('left',[4,5,6,7],10,true);
			player.animations.add('right',[8,9,10,11],10,true);
			player.animations.add('up',[12,13,14,15],10,true);
			player.animations.add('fall',[0,4,8,12],10,true);
			//Player collide world bounds
			player.body.collideWorldBounds = true;
			//Set player speed
			player.speed = 200;
			//Take track of the thefts (timestamp of the last one)
			player.lastTheft = 0;
			//Keep the player inside the street
			this.keepInTheStreet.push(player);
			//Some values to menage the drains-teleporting
			player.allowTeleport = true;
			player.isTeleporting = false;
			//Set update function
			player.move = this.game.device.desktop? moveDesktop : moveMobile;
			player.update = updatePlayer;

			return player;
		}

/*Main function to update the player
*/
function moveMobile() {	
			play.joystick.resetFrames();
			//Move the player
			if (play.joystick.down.isDown){
				play.joystick.down.frame = 1;
				this.body.velocity.setTo(0,this.speed);
				this.animation = 'down'
			}
			else if (play.joystick.left.isDown){
				play.joystick.left.frame = 1;
				this.body.velocity.setTo(-this.speed,0);
				this.animation = 'left'
			}
			else if (play.joystick.right.isDown){
				play.joystick.right.frame = 1;
				this.body.velocity.setTo(this.speed,0);
				this.animation = 'right'
			}
			else if (play.joystick.up.isDown){
				play.joystick.up.frame = 1;
				this.body.velocity.setTo(0,-this.speed);
				this.animation = 'up'
				
			}
			else{
				this.body.velocity.setTo(0,0);
				this.animation = null;
			}
	}
 function moveDesktop() {
			//Move the player
			if (cursors.down.isDown){
				this.body.velocity.setTo(0,this.speed);
				this.animation = 'down'
			}
			else if (cursors.left.isDown){
				this.body.velocity.setTo(-this.speed,0);
				this.animation = 'left'
			}
			else if (cursors.right.isDown ){
				this.body.velocity.setTo(this.speed,0);
				this.animation = 'right'
			}
			else if (cursors.up.isDown ){
				this.body.velocity.setTo(0,-this.speed);
				this.animation = 'up'
				
			}
			else{
				this.body.velocity.setTo(0,0);
				this.animation = null;
			}
	}
function updatePlayer(){
			//Play animation
			if (this.animation)
				this.animations.play(this.animation);
			else
				this.animations.stop();
	}	

/* Add some functions to the Phaser.Button prototype */

Phaser.Button.prototype.goDown = function (soundKey){
					this.frame = 1;
					this.text.y += 5;
					if (this.game.soundOn && soundKey)
						this.game.sound.play(soundKey);
}

Phaser.Button.prototype.goUp = function (soundKey){
					this.frame = 0;
					this.text.y -= 5;
					if (this.game.soundOn && soundKey)
						this.game.sound.play(soundKey);
}


/*Create a text on the button referenced by the "text" property of the button (an instance of Phaser.Text), if existing change the content,
*@param: text, {string} thw text to write on the button
*/

Phaser.Button.prototype.setText = function (text){
					if (this.text)
						this.text.text = text;
					else{
						this.text = this.game.add.text(0,0, text, {font: game.textFont, 
											   fill: game.textstyle.buttons.color, 
											   fontSize: game.textstyle.buttons.size});
						this.addChild(this.text);
						this.text.anchor.setTo(0.5,0.5);
					}
}

/* This function build and returns a button 
* @param: x,y the position of the button (the center);
* @param: text, {string} the text to set on the button (optional);
* @param: setInputCallbcks, {bool} if true goDown and goUp will be set as callbacks;
* @param: downSound,upSound {string} the keys of the sound to play when the button moves up/down (optional);
* @return: a Phaser.Button
*/
Phaser.Game.prototype.createButton = function (x,y,text,setInputCallbacks,downSound,upSound){
					var button = this.add.button(x,y,'button');
					button.anchor.setTo(0.5,0.5);
					if (setInputCallbacks){
						button.onInputDown.add(function(){this.goDown(downSound);},button);
						button.onInputUp.add(function(){this.goUp(upSound);},button);
					}
					if (text)
						button.setText(text);
					return button;
}
	
					

play.createHitButton = function(x,y){
		var button = this.add.button(x,y,'hitButton',play.treasures.hit);
		button.anchor.setTo(0.5,0.5);
		button.fixedToCamera = true;
		button.text = this.add.text(button.x,button.y,this.game.lang.hit_button,
			{font: this.game.textFont, fill: game.textstyle.hit_button.color.released, fontSize: game.textstyle.hit_button.size});
		button.text.anchor.setTo(0.5,0.5);
		button.text.fixedToCamera = true;
		button.onInputDown.add(function() { button.text.fill = game.textstyle.hit_button.color.pressed;});
		button.onInputUp.add(function() { button.text.fill = game.textstyle.hit_button.color.released;});
		return button;
	}

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
		board.label.text = this.make.text(board.label.x,board.label.y,'',
				{font: this.textFont, fill: game.textstyle.panels.label.color, fontSize: game.textstyle.panels.label.size});
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
		

play.createTimer = function(){
		var timer = this.time.create(false);
		timer.left = this.level.time;
		timer.updateTime = updateTime;
		timer.timeLeftEvent = timer.loop(1000,timer.updateTime.bind(timer));
		return timer;
}


function updateTime(){
		this.left--;
		if (this.left === 0){
			this.remove(this.timeLeftEvent);
			play.gameover();
		} else if (this.left <= 10){
			this.game.playsound('beep_sound');
			this.text.addColor('#FF0000',0);
			this.text.count.addColor('#FF0000',0);
		}
		//Update text timer
		play.timer.text.count.setText(this.left);
		//TIMER BASED EVENTS
		//Speed bonuses
		play.boots.generate();
}



//This value will be the vertical dimension of the space occupied on the game surface
var feetHeight = 15;

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
	else{ 
		object.anchor.setTo(0.5,1);
		//object.body.setSize(object.width/3,feetHeight,object.width/4,object.height-feetHeight);
		object.body.setSize(object.width/2,feetHeight);
	}
}


/*Create and returns a new group containing all the elements of the current group, so the current group will be so organised 
* Group->subGroup->[previous content of Group]. The main use of this function to create a subGroup in order to set a pause on it
* and still be able to create and update new elements in the current group.
* @returns: subWorld [Phaser.Group]
*/
Phaser.Group.prototype.createSubGroup = function(){
						//Create an empty group with no parents related to the current Phaser.Game object
						var subGroup = new Phaser.Group(this.game,null); 
						//Move all the content of the current group to the subGroup
						while (this.length > 0)
							subGroup.add(this.children[0]);
						//Now that the group is empty add the subGroup to is
						this.add(subGroup);
						//Return the subGroup
						return subGroup;
}
/*Set a simple pause preventing the given elements from being updated or interact with the user
* @param: {Array of Phaser.Group} groups - an array containing all the groups to prevent from updating
* @param: {Array of Phaser.Timer} timers - an array containing all the timers to pause
* @param: {Array of Phaser.Button} buttons - an array of all the buttons to disable
* @param: {bool} disableKeyboard - a value of true will disable all the inputs from the keyboard
*/
Phaser.Game.prototype.setPause = function(groups,timers,buttons,disableKeyboard){
					var i;
					//Prevent all the groups from updating
					if (groups){
						for (i = 0; i < groups.length; i++)
							groups[i].exists = false;
					}
					//Pause the timers in order to stop the related events from dispatching
					if (timers){
						for (i = 0; i < timers.length; i++)
							timers[i].pause();
					}
					//Stop the buttons from receiving inputs
					if (buttons){
						for (i = 0; i < buttons.length; i++)
							buttons[i].inputEnabled = false;
					}
					//Disable keyboard if necessary
					if (disableKeyboard){
						this.input.keyboard.enabled = false;
						this.input.reset(false);
					}
}

/*Unset a pause preventing the given elements from being updated or interact with the user
* @param: {Array of Phaser.Group} groups - an array containing all the groups we want to update
* @param: {Array of Phaser.Timer} timers - an array containing all the timers to resume
* @param: {Array of Phaser.Button} buttons - an array of all the buttons to enable
* @param: {bool} disableKeyboard - a value of true will enable all the inputs from the keyboard
*/
Phaser.Game.prototype.unsetPause = function(groups,timers,buttons,enableKeyboard){
					var i;
					//Allow update on the given groups 
					if (groups){
						for (i = 0; i < groups.length; i++)
							groups[i].exists = true;
					}
					//Pause the timers in order to stop the related events from dispatching
					if (timers){
						for (i = 0; i < timers.length; i++)
							timers[i].resume();
					}
					//Enable buttons to receive input
					if (buttons){
						for (i = 0; i < buttons.length; i++)
							buttons[i].inputEnabled = true;
					}
					//Disable keyboard if necessary
					if (enableKeyboard){
						this.input.keyboard.enabled = true;
					}
}


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
/*Little shortcut set as property of the game object in order to play one sound only when the sound enabled
* @param: the key of the sound to play {string}
*/
Phaser.Game.prototype.playsound = function (key){
	if (this.soundOn)
		this.sound.play(key);
};

//Define 'game' as a global variable
var game;

window.onload = function (){
		//Create a Phaser.Game object
		game = new Phaser.Game(1200,750,Phaser.AUTO,'game');
		//Let's add the all the states we created before
		game.state.add('Boot',boot);
		game.state.add('Load',load);
		game.state.add('Menu',menu);
		game.state.add('Play-intro',play_intro);
		game.state.add('Play',play);	
		//We launch the 'Boot' state
		game.state.start('Boot');
}
