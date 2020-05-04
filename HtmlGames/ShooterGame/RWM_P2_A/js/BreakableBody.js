var BreakableBody = (function () 
{

   

function BreakableBody(posX,posY,width,height,userData,level)
{
            this.m_body1 = null;
            this.m_velocity = 1000;
            this.m_angularVelocity = 90;
            this.m_shape1 = null;
            this.shape2 = null;
            this.m_piece1 = null;
            this.m_piece2 = null;
            this.m_broke = false;
            this.m_break = false;
            this.e_count = 7;
            
            posX =  Physics.pixelToMeters(posX);
            posY =  Physics.pixelToMeters(posY);
            var fixDef = new b2FixtureDef;
            fixDef.density = 1.0;
            fixDef.friction = 1.0;
            fixDef.restitution = 0.0;
            fixDef.shape = new b2PolygonShape;
            this.position  = new b2Vec2(posX,posY);
            this.m_velocity = new b2Vec2(0,100);
            
            var m_shape1 = new b2PolygonShape();
            var m_shape2 = new b2PolygonShape();
            
             var breakBodyDef = new b2BodyDef();
             breakBodyDef.type = b2Body.b2_staticBody;
             breakBodyDef.position = new b2Vec2(posX,posY);
             //breakBodyDef.angle = 45;
             this.width = width;
             this.height = height;
        
             this.m_body1 = Physics.world.CreateBody(breakBodyDef);

             //1.5,0.5 w + h 
             this.m_shape1 = new b2PolygonShape();
             this.m_shape1.SetAsOrientedBox(this.width,this.height, new b2Vec2(0.5, 0), 0.0);
             this.m_piece1 = this.m_body1.CreateFixture2(this.m_shape1, 1.0);

             this.m_shape2 = new b2PolygonShape();
             this.m_shape2.SetAsOrientedBox(this.width,this.height, new b2Vec2(3.5, 0), 0.0);
             this.m_piece2 = this.m_body1.CreateFixture2(this.m_shape2, 1.0);

             breakBodyDef.position.x = posX;
             breakBodyDef.position.y = posY;

             this.m_body1.SetUserData("BreakableBody"+Math.floor(posX)); //Give it a unqine name
             //this.m_body1.SetUserData("FullBody");
             
             var fixture = new b2Fixture();
                fixture = this.m_body1.GetFixtureList();
        var filter = new b2FilterData();
        filter.categoryBits = Physics.BREAKABLE;
        filter.groupIndex = 0;
        filter.maskBits = Physics.PLAYER_ONE_BALL | Physics.PLAYER_TWO_BALL | Physics.PLAYER_ONE | Physics.PLAYER_TWO;
        fixture.SetFilterData(filter);
        fixture = fixture.GetNext();
        fixture.SetFilterData(filter);

             var _this = this;
             Physics.addContactListener(function(contact) 
             {
                    
                    var isColliding = Physics.isObjectColliding("p1Ball",_this.m_body1.GetUserData(),contact);

                    if(isColliding)
                    {
                        _this.m_break = true;
                        console.log("hit")
                    }
                    var isColliding = Physics.isObjectColliding("p2Ball",_this.m_body1.GetUserData(),contact);

                    if(isColliding)
                    {
                        _this.m_break = true;
                        console.log("hit")
                    }

                   // var p1Hit = Physics.isObjectColliding(_this.body1.GetUserData(), "player1", contact);


                    // if(p1Hit)
                    // {
                    //     console.log("pihit");
                    //     level.getEntity("player1").curHealth -= 2;
                        
                    // }

                    // var p2Hit = Physics.isObjectColliding(_this.body1.GetUserData(),"player2", contact);

                    // if(p2Hit)
                    // {
                        
                    //     console.log("p2Hit");
                    //     level.getEntity("player2").curHealth -= 2;
                    // }
            

             });
}

    BreakableBody.prototype.Break = function ()
    {
            console.log("broke");

            this.body1 = this.m_piece1.GetBody();
            this.body2 = this.m_piece2.GetBody();

            this.body1.SetUserData("BreakablePiece1"); //Give it a unqine name
            this.body2.SetUserData("BreakablePiece2"); //Give it a unqine name

            

            var center1 = this.body1.GetWorldCenter();
            var center2 = this.body2.GetWorldCenter();
              
            
            this.body1.DestroyFixture(this.m_piece1);
            this.body2.DestroyFixture(this.m_piece2);
            
            this.m_piece1 = null;
            this.m_piece2 = null;
            

            var bodyDef = new b2BodyDef();
            bodyDef.type = b2Body.b2_dynamicBody;
            bodyDef.position = this.body1.GetPosition();
            //bodyDef.angle = 45;
            
            this.body2 = Physics.world.CreateBody(bodyDef);
            this.m_piece1 = this.body2.CreateFixture2(this.m_shape1,1.0);

            this.body3 = Physics.world.CreateBody(bodyDef);
            this.m_piece2 = this.body3.CreateFixture2(this.m_shape2,1.0);

           
            var center1 = this.body1.GetWorldCenter();
            var center2 = this.body2.GetWorldCenter();
                    

            var body1 = Physics.world.CreateBody(bodyDef);
            var body2 = Physics.world.CreateBody(bodyDef);
            

            var velocity1 = 1000;
            var velocity2 = 1000;
            

            body1.SetAngularVelocity(this.m_angularVelocity);
            body1.SetLinearVelocity(velocity1);
            body2.SetAngularVelocity(this.m_angularVelocity);
            body2.SetLinearVelocity(velocity2);
    }
    BreakableBody.prototype.draw = function(ctx) 
    {
        this.position = this.m_body1.GetPosition();
        if(this.m_break != false)
        {
            ctx.save();
            ctx.translate( (Physics.metersToPixels(this.position.x)), Physics.metersToPixels(this.position.y) );
            ctx.rotate(this.m_body1.GetAngle());
            ctx.drawImage(AssetManager.images["breakablebody"],
            Physics.pixelToMeters(this.position.x) - Physics.metersToPixels(1),
            Physics.pixelToMeters(this.position.y) - Physics.metersToPixels(0.7),
            180,
            40);
        ctx.restore();  
        }
    };
    BreakableBody.prototype.getBody = function() 
    {
        return this.m_body1;
    };
    BreakableBody.prototype.update = function ()
    {
            if(this.m_break)
            {
                this.Break();
                this.m_broke = true;
                this.m_break = false;
            }
            if(this.m_broke == false)
            {
                this.m_velocity = this.m_body1.GetLinearVelocity();
                this.m_angularVelocity = this.m_body1.GetAngularVelocity();
            }

    }
    return BreakableBody;
})();
