var Game = (function () {

    this.canvas;        //reference to canvas 
    this.canvasContext;  // reference to canvas drawing context
    this.level;          // manages all the objects 
    this.curLevel;

    function Game() {

        setTimeout(function () {
            $('#splashScreen').fadeOut('normal');
            $('#loadIcon').remove();
        }, 1000);

        Graphics.init();
        this.canvas = Graphics.createCanvas("gameCanvas");
        this.canvasContext = this.canvas.getContext("2d");		
        Physics.init(this.canvas);  
     
        // Creating the level
        this.level = new Level();
		this.level.loadUp(level2JSON, this.canvas,0);

        this.currentLevel = 1; 
        this.currentChanginglevel = false;    	
    }

    Game.prototype.update = function () {     
      this.level.update();
      this.checkForLevelSwitch();
    };

    // Switchs between levels and info's which ever player that dies they suck
    Game.prototype.checkForLevelSwitch = function() {
        if(
            this.currentChanginglevel == false && 
          ( this.level.getEntity("player1").curHealth <= 0 || this.level.getEntity("player2").curHealth <= 0) ) 
        {
            this.currentChanginglevel = true;
            var message;
            if(this.level.getEntity("player1").curHealth <= 0)
            {
                message = "<h1>Player 1 you suck!</h1>"
            }else{
                message = "<h1>Player 2 you suck!<h1>"
            }

            var _this = this;
 
            $('#splashScreen').fadeIn('normal');
            $('#splashScreen').append(message);                    

            setTimeout(function () {
                    $('#splashScreen').fadeOut('normal');
                    _this.currentLevel++;

                    if(_this.currentLevel == 2)
                    {
                        _this.level.loadUp(level1JSON, _this.canvas,0);
                    }else if(_this.currentLevel == 3)
                    {
                        _this.level.loadUp(Level3JSON, _this.canvas,1);
                    }
                    _this.currentChanginglevel = false;
                    $('#splashScreen').empty();
                },1800);         
       }
    };

    Game.prototype.draw = function () {
      this.level.draw(this.canvasContext);    
    };

    Game.prototype.step = function () {

        Physics.world.Step(
              (1 / 60)
           , 10       //velocity iterations
           , 10       //position iterations
        );
        Physics.world.DrawDebugData();
        Physics.world.ClearForces();

    };

    return Game;
})();
