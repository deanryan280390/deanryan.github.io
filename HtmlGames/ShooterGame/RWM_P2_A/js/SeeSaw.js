// Name:	SeeSaw.js
// Author: Gearóid Neville
// Brief:	This is the See Saw Class. This class sets up,
//			creates, and updates all the See Saw Objects
//			in the Game.
// Arguments: N/A
// Returns: N/A

var SeeSaw = ( function () {
	this._Position;
	this._positionX;															// The X Position of a See Saw.
	this._positionY;															// The Y Position of a See Saw.
	this._width;																// The Width of a See Saw.
	this._height;																// The Height of a See Saw.
	this._body;																    // The Physical Body of a See Saw.
	this._bodyDef;															    // The Body Definition of a See Saw.
	this._bodyFixtureDef;													    // The Body Fixture Definition of a See Saw.
	this._pivotFixtureDef;														// The Pivot Fixture Definition of a See Saw.
	this._revoluteJointDef;														// The Revolute joint Definition used to make the See Saw.
	this._revoluteJoint;														// The Revolute Joint used to make the See Saw.
	this._pivotRadius;															// The radius of the Pivot of the See Saw.
	this._pivotBody;															// The Physical Body of the Pivot of the See Saw.
	this._pivotBodyDef;															// The Phsyical Body Definition of the Pivot of the See Saw.
	this._image;																// The image of the See Saw Object.
	this._imageWidth;															// Width of the Sprite.
	this._imageHeight;															// Height of the Sprite.
	
	// Name: See Saw
	// Brief: This is the Constructor of the Class.
	//		  It initialises it's core members and draws the See Saw Object.
	//		  It also connect the Pivot and See Saw together.
	// Arguments: posX   ( The X Position of the See Saw )
	//			  posY   ( The Y Position of the See Saw )
	//			  width  ( The width of the See Saw )
	//			  height ( The height of the See Saw )
	// Returns: N/A
	
	function SeeSaw( posX, posY, width, height ,userData ) {
		// Setting the Position of a See Saw.
		this._position = new b2Vec2(posX, posY);
		// Setting the Width of a See Saw.
		this._width = width;
		// Setting the Height of a See Saw.
		this._height = height;														
		
		// Create a new Body Definition for the See Saw.
		this._bodyDef = new b2BodyDef;
		// Define Object type for the See Saw.
		this._bodyDef.type = b2Body.b2_dynamicBody;
		// Define Position of the See Saw.
		this._bodyDef.position.Set(Physics.pixelToMeters(this._position.x)			
		, Physics.pixelToMeters(this._position.y));
		//set user data
		
		// Create a new Fixture Definition for a See Saw.	
		this._bodyFixtureDef = new b2FixtureDef;
		// Define Density of the See Saw.
		this._bodyFixtureDef.density = 10.0;
		// Define Friction of the See Saw.
		this._bodyFixtureDef.friction = 0.4;
		// Define Restitution of the See Saw.	
		this._bodyFixtureDef.restitution = 0.03;
		// Define Shape of the See Saw.
		this._bodyFixtureDef.shape = new b2PolygonShape;
		// Define Size of the See Saw.
		this._bodyFixtureDef.shape.SetAsBox(Physics.pixelToMeters(this._width),		
		Physics.pixelToMeters(this._height));

		
		// Create a new Body Definition for the Pivot.
		this._pivotBodyDef = new b2BodyDef;
		// Define Object type for the Pivot.		
		this._pivotBodyDef.type = b2Body.b2_staticBody;
		// Define Position of the Pivot.
		this._pivotBodyDef.position.Set(
			Physics.pixelToMeters(this._position.x), 
			Physics.pixelToMeters(this._position.y + (this._height/2))
		);
		// Create a new Fixture Definition for a Pivot.
		this._pivotFixtureDef = new b2FixtureDef;
		// Define Density of the Pivot.		
		this._pivotFixtureDef.density = 0.1;
		// Define Shape of the Pivot.
		this._pivotFixtureDef.shape = new b2CircleShape(Physics.pixelToMeters(5)); 
	
		// Create the See Saw Body in the Game World.
		this._body = Physics.world.CreateBody(this._bodyDef);
		// Create the defined Fixture for the See Saw Body.	
		this._body = this._body.CreateFixture(this._bodyFixtureDef).GetBody();	
		// Create the Pivot Body in the Game World.
		this._pivotBody = Physics.world.CreateBody(this._pivotBodyDef);	
		// Create the defined Fixture for the Pivot Body.	
		this._pivotBody = this._pivotBody.CreateFixture(this._pivotFixtureDef).GetBody();
		
		// Create a Revolute Joint Definition for the See Saw.
		this._revoluteJointDef = new b2RevoluteJointDef;
		// Initialises the Revolute Joint for the See Saw by connecting the See Saw and the Pivot.
		this._revoluteJointDef.Initialize(this._body, this._pivotBody, this._body.GetWorldCenter());
		// Create the Revolute Joint using the defined Fixture.
		this._revoluteJoint = Physics.world.CreateJoint(this._revoluteJointDef);
		// Enable the limit for the See Saw, so it doesn't spin out of control.
		this._revoluteJoint.EnableLimit(true);
		// Setting the limit in Radians for the max angle it can rotate.
		this._revoluteJoint.SetLimits(-0.6108, 0.6108);

		// Setting the Width of the Sprite.
		this._imageWidth = 50;
		// Setting the Height of the Sprite.
		this._imageHeight = 30;
		var filter = new b2FilterData();
		filter.categoryBits = Physics.PLATFORM;
		filter.groupIndex = 0;
		filter.maskBits = Physics.PLAYER_ONE | Physics.PLAYER_TWO | Physics.PLAYER_ONE_BALL | Physics.PLAYER_TWO_BALL;
		this._body.GetFixtureList().SetFilterData(filter);

		this._body.SetUserData(userData);
		
	}; 

	// Name: Draw
	// Brief: This function draws a Sprite onto the See Saw Object.
	// Arguments: ctx   ( the Context we are using )
	// Returns: N/A
	SeeSaw.prototype.draw = function(ctx) {
	
		this._position = this._body.GetPosition();
		ctx.save();

        ctx.translate( (Physics.metersToPixels(this._position.x)),
		Physics.metersToPixels(this._position.y) );
        ctx.rotate(this._body.GetAngle());
       
		ctx.drawImage(AssetManager.images["seesaw"],
		-this._width,
		-this._height,
		this._width * 2,
		this._height * 2);

        ctx.restore();	
	}; // End Function Draw().

	SeeSaw.prototype.getBody = function() {
		return this._body;
	};

	SeeSaw.prototype.update = function() {
		
	};

    return SeeSaw;
} )();