var NormalPlatform = (function() {
	

	function NormalPlatform(x,y,width,height,userData,angle)
	{
		this.body; //Reference to body
		this.fixture; // refernce to fixture
		this.width = width;
		this.height = height;
		this.userData = userData

		var bodyDef = new b2BodyDef;
		bodyDef.type = b2Body.b2_staticBody;

		var fixDef = new b2FixtureDef;
		fixDef.density = 1.0;
		fixDef.friction = 1.0;
		fixDef.restitution = 0.0;
		fixDef.shape = new b2PolygonShape;

		fixDef.shape.SetAsBox(Physics.pixelToMeters(width/2),Physics.pixelToMeters(height/2));

		bodyDef.position.x =  Physics.pixelToMeters(x);
		bodyDef.position.y =  Physics.pixelToMeters(y);
		this.fixture = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef);
		this.body = this.fixture.GetBody();

		if(angle != 0)
		{
			this.body.SetAngle(0.785398163)
		}

		this.body.SetUserData(userData);
		var filter = new b2FilterData();
		filter.categoryBits = Physics.PLATFORM;
		filter.groupIndex = 0;
		filter.maskBits = Physics.PLAYER_ONE | Physics.PLAYER_TWO | Physics.PLAYER_ONE_BALL | Physics.PLAYER_TWO_BALL;
		this.body.GetFixtureList().SetFilterData(filter);
	}

	NormalPlatform.prototype.draw = function(ctx) {
		var position = b2Vec2(0,0);	
		position = this.body.GetPosition();
	
		if ( this.userData == 'hurtbox' ) {
			ctx.save();
			ctx.translate( (Physics.metersToPixels(position.x)),
			Physics.metersToPixels(position.y) );
			ctx.rotate(this.body.GetAngle());
			ctx.drawImage(AssetManager.images["spikes"],
			Physics.pixelToMeters(position.x) - this.width/2,
			Physics.pixelToMeters(position.y) - this.height/2,
			this.width,
			this.height);
			ctx.restore();	
	
		}
		
		else {
			ctx.save();
			ctx.translate( (Physics.metersToPixels(position.x)),
			Physics.metersToPixels(position.y) );
			ctx.rotate(this.body.GetAngle());
			ctx.drawImage(AssetManager.images["normalplatform"],
			Physics.pixelToMeters(position.x) - this.width/2,
			Physics.pixelToMeters(position.y) - this.height/2,
			this.width,
			this.height);
			ctx.restore();	
		}
	};

	NormalPlatform.prototype.update = function() {
		// body...
	};

	NormalPlatform.prototype.getBody = function() {
		return this.body;
	};

	return NormalPlatform;

})();