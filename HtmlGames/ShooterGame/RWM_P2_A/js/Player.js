var Player = (function (){
	
	function Player(x, y,userData) {

		if("player1" == userData)
		{
					//[left,right,up,shoot,rotateleft,rotateright]
			var keys = [68,65,87,32,190,188];
			var catagoryBits = Physics.PLAYER_ONE;
			var maskBits = Physics.PLATFORM | Physics.PLAYER_TWO_BALL | Physics.PLAYER_TWO | Physics.BREAKABLE;
		}

		if("player2" == userData)
		{
			var keys = [39,37,38,98,99,97];
			var catagoryBits = Physics.PLAYER_TWO; 
			var maskBits = Physics.PLATFORM | Physics.PLAYER_ONE_BALL | Physics.PLAYER_ONE | Physics.BREAKABLE;
		}

		var box = new b2BodyDef;
		this.keyCodes = keys;
      	box.type = b2Body.b2_dynamicBody;
      	box.allowSleep = false;
      	box.userData = userData;
      	this.playerBody = null;
		this.fixDef1 = new b2FixtureDef();
		this.fixDef1.density = 1.4;
		

		var fixDef2 = new b2FixtureDef();
      	this.fixDef1.shape = new b2PolygonShape;
      	fixDef2.shape = new b2CircleShape(0.5);
        this.fixDef1.shape.SetAsBox(0.5,0.5);

        box.position.x = Physics.pixelToMeters(x);
        box.position.y = Physics.pixelToMeters(y);
		this.pad = new GamePad();
		this.pad.Connect(); 
 		this.currentVolicty = null;
 		this.playerBody = Physics.world.CreateBody(box);
 		this.playerBody.CreateFixture(this.fixDef1);
		this.playerBody.CreateFixture(fixDef2);
		this.playerBody.SetFixedRotation(true);

		
		this.maxJump = 10;
		this.minJump = 1;

		var fixture = new b2Fixture();
		fixture = this.playerBody.GetFixtureList();
		var filter = new b2FilterData();
		filter.categoryBits = catagoryBits;
		filter.groupIndex = 0;
		filter.maskBits = maskBits;
		fixture.SetFilterData(filter);
		if("player2" == userData)
		{
			
			fixture = fixture.GetNext();
			fixture.SetFilterData(filter);
		}


		this.gotoAngle = 0;
		this.jump = 0;

		this.targetDirection = new b2Vec2(this.playerBody.GetPosition().Copy().x+50, this.playerBody.GetPosition().Copy().y);
		this.targetDirection.Multiply(5);
		this.targetAngle = 0;
		var axisX = -this.pad.controllAxis(2);
		var axisY = this.pad.controllAxis(3);
		this.useKeyBoard = true;			
		this.currentangalur  = 0;//Math.floor(Math.atan2(axisX,axisY)*(180/Math.PI));
 		this.cannonBalls = new Array();
 		this.manualBalls = new Array();
		this.maxBalls = 30;
		this.curBalls = 0;
		this.triggerDown = false;

		this.maxHealth = 100;
		this.curHealth = 100;	
		this.healthBarWidth = 200;	

		this.direction = 1;
		this.dirLastFrame = 1;
		//this.playerBody.SetUserData( "player"); //Give it a unqine name
		this.drawManualBalls = false;
		this.toggleManual = false;

		var _this = this;
		 Physics.addContactListener(function(contact){

		 	var p1Hit = Physics.isObjectColliding("player1", "p2Ball", contact);
		 	var isPlayerColliding = Physics.isObjectColliding("hurtbox",_this.playerBody.GetUserData(), contact);

		 	


		 	if(isPlayerColliding)
		 	{
		 		_this.curHealth-= _this.curHealth; // kill him
		 	}

		 	if(p1Hit)
		 	{
		 		if(_this.playerBody.GetFixtureList().GetBody().GetUserData() == "player1"){
	 				if(_this.curHealth>0){
						_this.curHealth-=2;
					}
	 			}
		 	}

		 	var p2Hit = Physics.isObjectColliding("player2", "p1Ball", contact);

		 	if(p2Hit)
		 	{
	 			
	 			if(_this.playerBody.GetFixtureList().GetBody().GetUserData() == "player2"){
	 				if(_this.curHealth>0){
						_this.curHealth-=2;
					}
	 			}
		 	}
		 	

		 	var that = _this;
		 	var checkAllowJump = function(){
		 		that.allowJump = Physics.isObjectColliding("hurtbox",that.playerBody.GetUserData(), contact);
			 	if(that.allowJump == true){this.jump = 0; return 0};
			 	that.allowJump = Physics.isObjectColliding("normal",that.playerBody.GetUserData(), contact);
			 	if(that.allowJump == true){this.jump = 0; return 0};
			 	that.allowJump = Physics.isObjectColliding("floatingplatform",that.playerBody.GetUserData(), contact);
			 	if(that.allowJump == true){this.jump = 0; return 0};
				that.allowJump = Physics.isObjectColliding("seesaw",that.playerBody.GetUserData(), contact);
				if(that.allowJump == true){this.jump = 0; return 0};
		 	}

		 	if(_this.playerBody.GetFixtureList().GetBody().GetUserData() == "player2")
		 	{
			 	checkAllowJump();
			 	this.allowJump = true;
			}


		 	if(_this.playerBody.GetFixtureList().GetBody().GetUserData() == "player1")
		 	{
			 	checkAllowJump();
			 	this.allowJump = true;
			}

		 })

		
	}

	Player.prototype.update = function()
	{
		this.currentVolicty = this.playerBody.GetLinearVelocity();
		var pos = this.playerBody.GetPosition();
		this.pad.Connect();
		if(this.pad.connected == true)
		{
			this.pad.update();
			this.useKeyBoard = false;
		}
		 if(keyboard.isKeyDown(this.keyCodes[0]) || this.pad.buttonPressed(15) || this.pad.controllAxis(0) > 0.5)
		 {
		 	this.currentVolicty.x = 5;
		 	this.direction = 1;

		 	if(this.dirLastFrame != this.direction && this.useKeyBoard == true) {

		 		
		 		var s = Math.sin(((90 -this.targetAngle)*(Math.PI/180))*2);
				var c = Math.cos(((90 -this.targetAngle)*(Math.PI/180))*2);
				// translate point back to origin:
				this.targetDirection.x -= 0;
				this.targetDirection.y -= 0;

				// rotate point
				var xnew = this.targetDirection.x * c - this.targetDirection.y * s;
				var ynew = this.targetDirection.x * s + this.targetDirection.y * c;
				// translate point back:
				this.targetDirection.x = xnew + 0;
				this.targetDirection.y = ynew + 0;
				this.targetAngle = 180 - this.targetAngle;
		 	}
		 }
		 if(keyboard.isKeyDown(this.keyCodes[1]) || this.pad.buttonPressed(14) || this.pad.controllAxis(0) < 0 && this.pad.controllAxis(0) < -0.5 )
		 {
		 	this.currentVolicty.x = -5;
		 	this.direction = -1;

		 	if(this.dirLastFrame != this.direction && this.useKeyBoard) {

				
				var s = Math.sin(((90 -this.targetAngle)*(Math.PI/180))*2);
				var c = Math.cos(((90 -this.targetAngle)*(Math.PI/180))*2);
				// translate point back to origin:

				// rotate point
				var xnew = this.targetDirection.x * c - this.targetDirection.y * s;
				var ynew = this.targetDirection.x * s + this.targetDirection.y * c;
				// translate point back:
				this.targetDirection.x = xnew + 0;
				this.targetDirection.y = ynew + 0;
				this.targetAngle = 180 - this.targetAngle;
		 	}
		 }
		 this.playerBody.SetLinearVelocity(this.currentVolicty);
		
		 	this.Jump();

		

		// Enter to fire 
		if(keyboard.isKeyDown(this.keyCodes[3]) || this.pad.buttonPressed(7)) { 
			
			if(this.triggerDown == false) {

				this.triggerDown = true;
			}
		}
		else if(this.triggerDown == true) {

			if(this.curBalls < this.maxBalls) {
				
				// Create and fire new cannon ball
				this.FireCannon(pos);
			}
			else if(this.curBalls >= this.maxBalls) {

				// Get index of longest living ball
				var index = 0;
				var lifeTime = 0;
				for(var i = 0; i < this.curBalls; i++) {
					if(this.cannonBalls[i].timeAlive > lifeTime) {

						lifeTime = this.cannonBalls[i].timeAlive;
						index = i;				
					}
				}

				// Delete longest living ball
				Physics.world.DestroyBody(this.cannonBalls[index].physicsBody);
				this.cannonBalls.splice(index, 1);
				this.manualBalls.splice(index, 1);
				this.curBalls--;

				// Create and fire new cannon ball
				this.FireCannon(pos);
			}

			this.triggerDown = false;
		}
		if(this.pad.connected == true)
		{
			if(this.pad.controllAxis(2) >= 0.2 || this.pad.controllAxis(2) <= -0.2 || this.pad.controllAxis(3) <= -0.2 && this.pad.controllAxis(3) >= 0.2 )
			{
					var axisX = -this.pad.controllAxis(2);
					var axisY = this.pad.controllAxis(3);
					

					this.targetAngle = Math.floor(Math.atan2(axisX,axisY)*(180/Math.PI)) +90;

					var angle = this.targetAngle -this.currentangalur;

					
					this.currentangalur = this.targetAngle;
					var s = Math.sin(angle*(Math.PI/180));
					var c = Math.cos(angle*(Math.PI/180));
					// translate point back to origin:
					this.targetDirection.x -= 0;
					this.targetDirection.y -= 0;

					// rotate point
					var xnew = this.targetDirection.x * c - this.targetDirection.y * s;
					var ynew = this.targetDirection.x * s + this.targetDirection.y * c;
					// translate point back:
					this.targetDirection.x = xnew + 0;
					this.targetDirection.y = ynew + 0;

			}

		}
		if(keyboard.isKeyDown(this.keyCodes[4]) || keyboard.isKeyDown(this.keyCodes[5])) {
			
			var angle;
			var rotate = false;
			
			
			if(keyboard.isKeyDown(this.keyCodes[4]))
			{
				angle = 1
				this.targetAngle++;

				if(this.direction == 1){

					if(this.targetAngle>90) {
						this.targetAngle= 90;
					}
					else {
				 		rotate = true;
				 	}
				}
				else {

					if(this.targetAngle>270) {
						this.targetAngle= 270;
					}
					else {
				 		rotate = true;
				 	}
				}
			}
			else
			{
			 	angle = -1;
			 	this.targetAngle--;

			 	if(this.direction == 1){

				 	if(this.targetAngle<-90) {
				 		this.targetAngle= -90;
				 	}
				 	else {
				 		rotate = true;
				 	}
				}
				else {

					if(this.targetAngle<90) {
						this.targetAngle= 90;
					}
					else {
				 		rotate = true;
				 	}
				}
			}
			if(rotate == true) {
				// Rotates target point around player pos
				var s = Math.sin(angle*(Math.PI/180));
				var c = Math.cos(angle*(Math.PI/180));
				// translate point back to origin:
				this.targetDirection.x -= 0;
				this.targetDirection.y -= 0;

				// rotate point
				var xnew = this.targetDirection.x * c - this.targetDirection.y * s;
				var ynew = this.targetDirection.x * s + this.targetDirection.y * c;
				// translate point back:
				this.targetDirection.x = xnew + 0;
				this.targetDirection.y = ynew + 0;
			}
		}

		
		this.playerBody.SetLinearVelocity(this.currentVolicty);

		if(keyboard.isKeyDown(88)) {

			if(this.toggleManual == false) {

				this.toggleManual = true;
			}

			
		}
		else if(this.toggleManual == true) {

			if(this.drawManualBalls == false) {
				this.drawManualBalls = true;
			}
			else {
				this.drawManualBalls = false;
			}

			this.toggleManual = false;
		}


		for(var i = 0; i < this.curBalls; i++) {

			this.cannonBalls[i].timeAlive++;
			this.manualBalls[i].update(0.1);
		}


		if(this.curHealth <= 0){
			// Load next level

		}

		this.dirLastFrame = this.direction;
			
	};

	Player.prototype.Jump = function()
	{	
		 if(keyboard.isKeyDown(this.keyCodes[2]) || this.pad.buttonPressed(0))
		 {
		 	
			if(this.allowJump == true && this.jump == 0)
		 	{
		 		this.jump = this.minJump;
		 	}
		 	if(this.maxJump <= this.jump && this.allowJump == true)
		 	{
		 		var point = new b2Vec2(0,0);
		 		var force = new b2Vec2(0,-this.jump);
			 	this.playerBody.ApplyImpulse(force,point);
			 	this.jump = 0;
			 	this.allowJump = false;
		 	}
		 	else if(this.allowJump == true)
		 	{
		 		this.jump = this.jump + 1;
		 	}
		 	if(this.currentVolicty.y == 0)
				this.allowJump = true;

		}
		else if(this.jump != 0 && this.allowJump == true)
		{
		 	var point = new b2Vec2(0,0);
		 	var force = new b2Vec2(0,-this.jump);
			this.playerBody.ApplyImpulse(force,point);
		 	this.jump = 0;
		 	this.allowJump = false;
		}

	};

	Player.prototype.draw = function(ctx)
	{
		var pos =  this.playerBody.GetPosition();
		var targetDir = this.targetDirection.Copy();
		targetDir.Normalize();
		targetDir.Add(pos);

		for(var i = 0; i < this.curBalls; i++) {
			
			if(this.drawManualBalls == true) {	
				this.manualBalls[i].draw(ctx);
			}

			this.cannonBalls[i].draw(ctx);
		}

		var frame;
		if(this.direction == 1) {
			frame = 0;
		}
		else if(this.direction == -1) {

			frame = 30;
		}

		ctx.drawImage(AssetManager.images[this.playerBody.GetFixtureList().GetBody().GetUserData()], frame, 0, 30, 39, Physics.metersToPixels(pos.x)-15, Physics.metersToPixels(pos.y)-30, 30, 45);


		ctx.save();

        ctx.translate( Physics.metersToPixels(pos.x), Physics.metersToPixels(pos.y) )
        ctx.rotate(this.targetAngle*(Math.PI/180))
        ctx.drawImage(AssetManager.images["cannon"], -10, -10, 35, 20);

        ctx.restore();

        var data = this.playerBody.GetFixtureList().GetBody().GetUserData();
        if(data == "player1") {

        	ctx.fillStyle = "rgb(255, 0, 0)";
            ctx.fillRect( 10 , 30, this.healthBarWidth, 10);
            ctx.fill();

            ctx.fillStyle = "rgb(0, 255, 0)";
            ctx.fillRect( 10 , 30, this.healthBarWidth*(this.curHealth/this.maxHealth), 10);
            ctx.fill();

            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.font="23px Arial";
			ctx.fillText("Player 1", 10, 23);
        }
        else if(data == "player2") {

			ctx.fillStyle = "rgb(255, 0, 0)";
            ctx.fillRect( 810 , 30, this.healthBarWidth, 10);
            ctx.fill();

            ctx.fillStyle = "rgb(0, 255, 0)";
            ctx.fillRect( 810 + (this.maxHealth-this.curHealth)*2, 30, this.healthBarWidth*(this.curHealth/this.maxHealth), 10);
            ctx.fill();

            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.font="23px Arial";
			ctx.fillText("Player 2", 900, 23);
        }
	};

	Player.prototype.FireCannon = function(pos)
	{
		// Create and fire new cannon ball
		var data = this.playerBody.GetFixtureList().GetBody().GetUserData();
		if(data == "player1") {
			this.cannonBalls[this.curBalls] = new CannonBall(Physics.world,  pos.x, pos.y, Physics.PLAYER_ONE_BALL, Physics.PLAYER_TWO | Physics.PLAYER_ONE_BALL | Physics.PLAYER_TWO_BALL | Physics.PLATFORM | Physics.BREAKABLE, "p1Ball");
			var r = this.fixDef1.shape.m_radius*10;
			this.cannonBalls[this.curBalls].fire( pos.x+r, pos.y+r, this.targetDirection.x, this.targetDirection.y);
			this.manualBalls[this.curBalls] = new ManualPhysicsBall(pos,  this.targetDirection, 10, 5);
			this.curBalls++;
		}
		else if(data == "player2") {

			this.cannonBalls[this.curBalls] = new CannonBall(Physics.world,  pos.x, pos.y, Physics.PLAYER_TWO_BALL, Physics.PLAYER_ONE | Physics.PLAYER_ONE_BALL | Physics.PLAYER_TWO_BALL | Physics.PLATFORM | Physics.BREAKABLE, "p2Ball");
			var r = this.fixDef1.shape.m_radius*10;
			this.cannonBalls[this.curBalls].fire( pos.x+r, pos.y+r, this.targetDirection.x, this.targetDirection.y);
			this.manualBalls[this.curBalls] = new ManualPhysicsBall(pos,  this.targetDirection, 10, 5);
			this.curBalls++;
		}
	};

	Player.prototype.getBody = function() {
		return this.playerBody;
	};

	return Player;
})();
