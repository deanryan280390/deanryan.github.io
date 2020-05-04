// Used to manage the loading and exporting of maps
var Level = (function(){

	//Takes a level as a JSON string
	function Level(levelfile){

		this.levelEnities = []; // holds all the enities

		//Ajax request to load map
		//var _this = this;
		// Due to lab422 poxy problem can't do ajax load
		// $.getJSON(levelfile, function(data) {
		// 	_this.loadUp(data);	
		// 	Logger.log("Level from " + levelfile + " was loaded sucessfully");		
		// });
	}

	Level.prototype.add = function(enity) {
		this.levelEnities.push(enity);
		Logger.debug(enity);
	};

	Level.prototype.getEntity = function(userData) {
		for( var entity in this.levelEnities)
		{
			// NOTICE : this will only work for objects  with one body
			if(this.levelEnities[entity].getBody().GetUserData() == userData)
			{
				return this.levelEnities[entity];
			}
		}
	};

	Level.prototype.loadUp = function(data,canvas,debugOn) {
		this.levelEnities = [];
		// for some reason deleting all bodies cases errors
		// I belive its due to locking so when loading up level re-init the physics world
		Physics.init(canvas,debugOn)

		var _this = this;
		$.each(data, function(key, val) {
    			
    			//Loop over the JSON data and do the EVIL work
				for( var obj in val )
				{
					var constructorStr = "var type = new " + val[obj].type + "(";
					var propertyCount = Object.keys(val[obj]).length - 2;// one for "type" and one for the last

					for( var memberVar in val[obj])
					{
						if(memberVar != "type")
						{							
							constructorStr += val[obj][memberVar];							

							if(propertyCount > 0)
							{
								constructorStr += ","
							}
							propertyCount--;						
						}
					}

					if(val[obj].type == "BreakableBody")
					{
						constructorStr += ",_this";
					}

					constructorStr += ")"

					// EVAL or EVIL considered hamrful :)
					eval(constructorStr) // Your a sick man Ciarán! Yup! 
					_this.add(type);
				}

  			});

			Logger.debug(_this.levelEnities);

			golbal_TotalPads = 0;
	};

	Level.prototype.update = function() {
		for( var enity in this.levelEnities)
		{
			this.levelEnities[enity].update();
		}
	};


	Level.prototype.draw = function(ctx) {
		for( var enity in this.levelEnities)
		{
			this.levelEnities[enity].draw(ctx);
		}
	};

	return Level;

})();