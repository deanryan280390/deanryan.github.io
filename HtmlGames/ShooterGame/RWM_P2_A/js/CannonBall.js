
var CannonBall = (function () {

	function CannonBall(pB2dWorld, xPos, yPos, catagoryBits, maskBits, userData) {
	
		var fixDef = new b2FixtureDef();	
	    var bodyDef = new b2BodyDef();	
		
		fixDef.density = 0.5; 
		fixDef.friction = 0.5; 
		fixDef.restitution = 0.2;
		
		fixDef.shape= new b2CircleShape(0.3);		
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.Set(xPos, yPos);
		bodyDef.isBullet = false;
		bodyDef.userData = userData;
		this.physicsBody = pB2dWorld.CreateBody(bodyDef);
		this.physicsBody.CreateFixture(fixDef);

		var filter = new b2FilterData();
		filter.categoryBits = catagoryBits;
		filter.groupIndex = 0;
		filter.maskBits = maskBits;
		this.physicsBody.GetFixtureList().SetFilterData(filter);
		
		this.active = true;
		this.timeAlive = 0;
	}
		
	CannonBall.prototype.fire = function(xPos, yPos, targetX, targetY) {

		targetX *= 50;
		targetY *= 50;

		this.physicsBody.SetPosition(new b2Vec2(xPos, yPos));
		this.physicsBody.SetLinearVelocity(new b2Vec2(0, 0));
		this.direction = new b2Vec2(targetX-xPos, targetY-yPos);
		this.direction.Normalize();
		this.direction = new b2Vec2(this.direction.x, this.direction.y);
		
		this.physicsBody.ApplyForce( new b2Vec2(this.direction.x*150, this.direction.y*150), this.physicsBody.GetWorldCenter());
	};

	CannonBall.prototype.draw = function(ctx) {

		var pos = this.physicsBody.GetPosition();

		ctx.save()

        ctx.translate( Physics.metersToPixels(pos.x), Physics.metersToPixels(pos.y) )
        ctx.rotate(this.physicsBody.GetAngle())
        ctx.drawImage(AssetManager.images[this.physicsBody.GetFixtureList().GetBody().GetUserData()], -10, -10, 20, 20)
        ctx.restore()
}
	
	return CannonBall;
	
})();