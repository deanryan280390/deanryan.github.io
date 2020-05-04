// Floating platform  - Jira task [RWMPA-2]
// When the player jumps onto the platform which is supended and it moves them across the void
var FloatingPlatform = (function() {
	
	function FloatingPlatform(x,y,width,height,userData)
	{
		this.body; //Reference to body
		this.fixture; // refernce to fixture

		var bodyDef = new b2BodyDef;
		bodyDef.type = b2Body.b2_dynamicBody;

		var fixDef = new b2FixtureDef;
		fixDef.density = 1.0;
		fixDef.friction = 0.9;
		fixDef.restitution = 0.2;
		fixDef.shape = new b2PolygonShape;

		fixDef.shape.SetAsBox(Physics.pixelToMeters(width/2),Physics.pixelToMeters(height/2));

		bodyDef.position.x =  Physics.pixelToMeters(x);
		bodyDef.position.y =  Physics.pixelToMeters(y);//TODO CIARAN WHAT?
		this.fixture = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef);
		this.body = this.fixture.GetBody();

		//this.body.SetUserData( "FloatingPlatform"+x+y+width+height ); //Give it a unqine name
		this.body.SetUserData(userData);
		var anchor1 = new NormalPlatform(x-(width/2),0,1,1,"normal",0);
		var joint = new b2DistanceJointDef();
        var p1, p2, d;

        joint.frequencyHz = 2.0;
        joint.dampingRatio = 10.0;

        joint.bodyA = anchor1.body;
        joint.bodyB = this.body;
        joint.localAnchorA.Set(-Physics.pixelToMeters(width/2), -15.0);
        joint.localAnchorB.Set(-Physics.pixelToMeters(width/2), 0.0);
        p1 = joint.bodyA.GetWorldPoint(joint.localAnchorA, new b2Vec2());
        p2 = joint.bodyB.GetWorldPoint(joint.localAnchorB, new b2Vec2());
        p2.Subtract(p1);
        d = p2.Copy();
        joint.length = d.Length();
        Physics.world.CreateJoint(joint)

        var anchor2 =  new NormalPlatform(x+(width/2),0,1,1,"normal",0);
        var joint2 = new b2DistanceJointDef();
        var p1, p2, d;

        joint2.frequencyHz = 2.0;
        joint2.dampingRatio = 10.0;

        joint2.bodyA = anchor2.body;
        joint2.bodyB = this.body;
        joint2.localAnchorA.Set(Physics.pixelToMeters(width/2), -15.0);
        joint2.localAnchorB.Set(Physics.pixelToMeters(width/2), 0.0);
        p1 = joint2.bodyA.GetWorldPoint(joint2.localAnchorA, new b2Vec2());
        p2 = joint2.bodyB.GetWorldPoint(joint2.localAnchorB, new b2Vec2());
        p2.Subtract(p1);
        d = p2.Copy();
        joint2.length = d.Length();
        Physics.world.CreateJoint(joint2);
        var filter = new b2FilterData();
		filter.categoryBits = Physics.PLATFORM;
		filter.groupIndex = 0;
		filter.maskBits = Physics.PLAYER_ONE | Physics.PLAYER_TWO | Physics.PLAYER_ONE_BALL | Physics.PLAYER_TWO_BALL;
		this.body.GetFixtureList().SetFilterData(filter);
	}

	FloatingPlatform.prototype.getBody = function() {
		return this.body;
	};

	FloatingPlatform.prototype.update = function() {
		
	};

	FloatingPlatform.prototype.draw = function(ctx) {
		var position = b2Vec2(0,0);	
		position = this.body.GetPosition();
		ctx.save();

        ctx.translate( (Physics.metersToPixels(position.x)),
		Physics.metersToPixels(position.y) );
        ctx.rotate(this.body.GetAngle());
        ctx.drawImage(AssetManager.images["floatingplatform"],
		Physics.pixelToMeters(position.x) - Physics.metersToPixels(1.71),
		Physics.pixelToMeters(position.y) - Physics.metersToPixels(0.4),
		103,
		23);

        ctx.restore();	
	};


	return FloatingPlatform;

})();