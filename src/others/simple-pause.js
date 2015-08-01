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
