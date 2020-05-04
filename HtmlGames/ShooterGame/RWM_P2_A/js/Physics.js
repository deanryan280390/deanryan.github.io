// Just some short-cut renaming
var b2Vec2 = Box2D.Common.Math.b2Vec2,
	b2BodyDef = Box2D.Dynamics.b2BodyDef,
	b2Body = Box2D.Dynamics.b2Body,
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
	b2Fixture = Box2D.Dynamics.b2Fixture,
	b2World = Box2D.Dynamics.b2World,
	b2MassData = Box2D.Collision.Shapes.b2MassData,
	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
	b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
  b2FilterData = Box2D.Dynamics.b2FilterData;
	b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
	b2RevoluteJointDef =  Box2D.Dynamics.Joints.b2RevoluteJointDef,
	b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint,
  b2Transform = Box2D.Common.Math.b2Transform,
  b2ContactListener = Box2D.Dynamics.b2ContactListener,
	b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint,
  b2Contact = Box2D.Dynamics.Contacts.b2Contact,
  b2ContactEdge = Box2D.Dynamics.Contacts.b2ContactEdge,
  b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;

var Physics;
(function (Physics) {
    Physics.worldScale;
    Physics.world;
    Physics.debugDraw;
    Physics.contactFunctionsList = [];

    // Collision filter values for game entities
    Physics.PLAYER_ONE        = 0x0001;
    Physics.PLAYER_ONE_BALL   = 0x0002;
    Physics.PLAYER_TWO        = 0x0004;
    Physics.PLAYER_TWO_BALL   = 0x0008;
    Physics.PLATFORM          = 0x0010;
    Physics.BREAKABLE         = 0x0012;

    function init(canvas,debugOn) {
        Physics.worldScale = 30;
        Physics.world = new b2World(new b2Vec2(0, 10), true);
        Physics.debugDraw = new b2DebugDraw();
        Physics.debugDraw.SetSprite(canvas.getContext("2d"));
        Physics.debugDraw.SetDrawScale(Physics.worldScale);
        Physics.debugDraw.SetFillAlpha(0.3);
        Physics.debugDraw.SetLineThickness(1);
        if(debugOn)
        {
              Physics.debugDraw.SetFlags( b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        }else{
          Physics.debugDraw.SetFlags( b2DebugDraw.e_jointBit);
        }
        //TODO removed this from below line b2DebugDraw.e_shapeBit;
        
        Physics.world.SetDebugDraw(Physics.debugDraw);

		        //setup bounds of the world

		  // Create static ground
		  var bounds = 10;
		  var fixDef = new b2FixtureDef;
		  fixDef.density = 1.0;
		  fixDef.friction = 1.0;
		  fixDef.restitution = 0.2;
		  fixDef.shape = new b2PolygonShape;

		  var bodyDef = new b2BodyDef;
		  bodyDef.type = b2Body.b2_staticBody;

		  //bottom wall
		  fixDef.shape.SetAsBox(canvas.width / Physics.worldScale, 0);
		  bodyDef.position.x = 0;
		  bodyDef.position.y = canvas.height / Physics.worldScale;

		  var physicsBody = Physics.world.CreateBody(bodyDef);
      physicsBody.CreateFixture(fixDef);
      var setFilter = new b2FilterData();
      setFilter.categoryBits = Physics.PLATFORM;
      setFilter.groupIndex = 0;
      setFilter.maskBits = Physics.PLAYER_ONE | Physics.PLAYER_ONE_BALL | Physics.PLAYER_TWO | Physics.PLAYER_TWO_BALL;
      physicsBody.GetFixtureList().SetFilterData(setFilter);  
      physicsBody.SetUserData("boundary"); 

		  //left wall
		  fixDef.shape.SetAsBox(bounds / Physics.worldScale, canvas.height / Physics.worldScale);
		  bodyDef.position.x = bounds*-1/Physics.worldScale;
		  bodyDef.position.y = 0;
		  Physics.world.CreateBody(bodyDef).CreateFixture(fixDef);

      physicsBody = Physics.world.CreateBody(bodyDef);
      physicsBody.CreateFixture(fixDef);
      var setFilter = new b2FilterData();
      setFilter.categoryBits = Physics.PLATFORM;
      setFilter.groupIndex = 0;
      setFilter.maskBits = Physics.PLAYER_ONE | Physics.PLAYER_ONE_BALL | Physics.PLAYER_TWO | Physics.PLAYER_TWO_BALL;
      physicsBody.GetFixtureList().SetFilterData(setFilter);
      physicsBody.SetUserData("boundary");

		  //right wall
		  fixDef.shape.SetAsBox(0, canvas.height / Physics.worldScale);
		  bodyDef.position.x = canvas.width / Physics.worldScale;
		  bodyDef.position.y = 0;
		  Physics.world.CreateBody(bodyDef).CreateFixture(fixDef);

      physicsBody = Physics.world.CreateBody(bodyDef);
      physicsBody.CreateFixture(fixDef);
      var setFilter = new b2FilterData();
      setFilter.categoryBits = Physics.PLATFORM;
      setFilter.groupIndex = 0;
      setFilter.maskBits = Physics.PLAYER_ONE | Physics.PLAYER_ONE_BALL | Physics.PLAYER_TWO | Physics.PLAYER_TWO_BALL;
      physicsBody.GetFixtureList().SetFilterData(setFilter);
      physicsBody.SetUserData("boundary");

		   //top wall
		  fixDef.shape.SetAsBox(canvas.width / Physics.worldScale, bounds / Physics.worldScale);
		  bodyDef.position.x = 0;
		  bodyDef.position.y = bounds*-1/Physics.worldScale;
		  Physics.world.CreateBody(bodyDef).CreateFixture(fixDef);

      physicsBody = Physics.world.CreateBody(bodyDef);
      physicsBody.CreateFixture(fixDef);
      var setFilter = new b2FilterData();
      setFilter.categoryBits = Physics.PLATFORM;
      setFilter.groupIndex = 0;
      setFilter.maskBits = Physics.PLAYER_ONE | Physics.PLAYER_ONE_BALL | Physics.PLAYER_TWO | Physics.PLAYER_TWO_BALL;
      physicsBody.GetFixtureList().SetFilterData(setFilter);
      physicsBody.SetUserData("boundary");
    }


    Physics.init = init;
    function addContactListener(func) {
        Physics.contactFunctionsList.push(func);
        var listener = new b2ContactListener();
        var removalList = [];
        listener.BeginContact = function (contact) {
            var lenght = Physics.contactFunctionsList.length;
            for(var i = 0; i < lenght; i++) {
                var removefunc = Physics.contactFunctionsList[i](contact);
                if(removefunc) {
                    removalList.push(i);
                }
            }
            for(var i = 0; i < removalList.length; i++) {
                Utilies.deleteFromCollection(Physics.contactFunctionsList, removalList[i]);
            }
            removalList = [];
        };
        Physics.world.SetContactListener(listener);
    }
    Physics.addContactListener = addContactListener;

    function pixelToMeters(pixels) {
        return pixels / Physics.worldScale;
    }
    Physics.pixelToMeters = pixelToMeters;

    function metersToPixels(meters) {
        return meters * Physics.worldScale;
    }
    Physics.metersToPixels = metersToPixels;

    function isObjectColliding(userData1, userData2 ,contact)
    {
            var UserDataA = contact.GetFixtureA().GetBody().GetUserData();
            var UserDataB = contact.GetFixtureB().GetBody().GetUserData();

            //console.log( UserDataA  + " == player " + UserDataB  + "== " +_this.body.GetUserData());

                // If the contact is with the terrain and THIS body
            if (
                (UserDataA == userData1 || UserDataB == userData1) 
                && 
                (UserDataB == userData2 || UserDataA == userData2 )
            ) {
                return true;
            }else{
                return false;
            }

    }
    Physics.isObjectColliding = isObjectColliding;

})(Physics || (Physics = {}));




