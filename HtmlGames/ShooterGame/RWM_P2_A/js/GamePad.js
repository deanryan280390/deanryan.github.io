var golbal_TotalPads = 0;
var GamePad = (function(){
	
	function GamePad()
	{
		//var gamepadSupportAvailable = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;
		this.connected = false;
		this.pad = null;
		this.num = 0;
		this.ANALOGUE_BUTTON_THRESHOLD = 0.5;
	} 
	GamePad.prototype.Connect = function() {

		try{
			navigator.webkitGetGamepads()
		}catch(e){
			return true;
		}

		if(this.connected == true) 
			return;

		var gamepadSupportAvailable = navigator.webkitGetGamepads();
		if(gamepadSupportAvailable[golbal_TotalPads] != undefined )
		{
			this.pad = gamepadSupportAvailable[golbal_TotalPads];
			golbal_TotalPads++;
			this.num = golbal_TotalPads - 1;
			this.connected = true;
		}
 	
    
	};
	GamePad.prototype.update = function()
	{
		this.pad = navigator.webkitGetGamepads()[this.num];
	}
	GamePad.prototype.buttonPressed = function(buttonId) {
		if(this.connected == true)
		{
			return this.pad.buttons[buttonId] && (this.pad.buttons[buttonId] == 1);
		}
		else
		{
			return false;
		}
  		
  	};
  	GamePad.prototype.controllAxis = function(axisId) {
  		
  		if(this.connected != true)
			return false;


		 if (typeof this.pad.axes[axisId] != 'undefined') {

			return this.pad.axes[axisId];
		}
		
  		return false;
  	};


	return GamePad;
})();