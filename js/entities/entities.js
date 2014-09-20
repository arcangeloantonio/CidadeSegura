game.PlayerEntity = me.Entity.extend(
{	
	init:function (x, y, settings)
	{
		this.angle = 0;
		this._super(me.Entity, 'init', [x, y , settings]);
		this.body.setVelocity(3, 3);		
		this.speed = 0;
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);	
		this.alwaysUpdate = true;
	},
	update : function (dt)
	{
		this.speed *= 0.99;
		if (me.input.isKeyPressed('up') || me.input.isKeyPressed('down') || me.input.isKeyPressed('left') || me.input.isKeyPressed('right')) {
			if (me.input.isKeyPressed("left")) {
				this.angle -= 0.1;
			}
			if (me.input.isKeyPressed("right")) {
				this.angle += 0.1;
			}
			if (me.input.isKeyPressed("up")) {
				this.speed += 0.05;
				this.body.vel.x = Math.sin(this.angle) * this.speed * me.timer.tick;
				this.body.vel.y = -Math.cos(this.angle) * this.speed * me.timer.tick;
			}
			if (me.input.isKeyPressed("down")) {
				this.speed -= 0.05;
				this.body.vel.x = Math.sin(this.angle) * this.speed * me.timer.tick;
				this.body.vel.y = -Math.cos(this.angle) * this.speed * me.timer.tick;
			}			
		}
		else {
			this.body.vel.x *= 0.95;
			this.body.vel.y *= 0.95;
		}		
		this.body.update(dt);

		this.renderable.angle = this.angle;
		
		 if (this.body.vel.x!=0 || this.body.vel.y!=0)
		 {
			this._super(me.Entity, 'update', [dt]);
			return true;
		}
		return false;
			
			// check & update player movement
		
	 
		// check for collision with sthg
        //me.collision.check(this, true, this.collideHandler.bind(this), true);
	},
    
    
    /**
     * colision handler
     */
    collideHandler : function (response) {
 		if (response.b.body.collisionType === me.collision.types.ENEMY_OBJECT) {
			if ((response.overlapV.y>0) && !this.body.jumping) {
				// bounce (force jump)
				this.body.falling = false;
				this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
				// set the jumping flag
				this.body.jumping = true;
				// play some audio
				me.audio.play("stomp");
			}
			else {
				// let's flicker in case we touched an enemy
				this.renderable.flicker(750);
			}
		}
    }

});


// /**
 // * Coin Entity
 // */
// game.CoinEntity = me.CollectableEntity.extend(
// {	

	// init: function (x, y, settings)
	// {
		// // call the parent constructor
		// this._super(me.CollectableEntity, 'init', [x, y , settings]);

        // // set our collision callback function
        // this.body.onCollision = this.onCollision.bind(this);
	// },

	// onCollision : function ()
	// {
		// // do something when collide
		// me.audio.play("cling");
		// // give some score
		// game.data.score += 250;
		// // make sure it cannot be collected "again"
		// this.body.setCollisionMask(me.collision.types.NO_OBJECT);
		// // remove it
		// me.game.world.removeChild(this);
	// }
// });

// /**
 // * Enemy Entity
 // */
// game.EnemyEntity = me.Entity.extend(
// {	
	// init: function (x, y, settings)
	// {
		// // define this here instead of tiled
		// settings.image = "wheelie_right";
          
        // // save the area size defined in Tiled
		// var width = settings.width;
		// var height = settings.height;;

		// // adjust the size setting information to match the sprite size
        // // so that the entity object is created with the right size
		// settings.spritewidth = settings.width = 64;
		// settings.spritewidth = settings.height = 64;
		
		// // call the parent constructor
		// this._super(me.Entity, 'init', [x, y , settings]);
		
		// // set start/end position based on the initial area size
		// x = this.pos.x;
		// this.startX = x;
		// this.endX   = x + width - settings.spritewidth
		// this.pos.x  = x + width - settings.spritewidth;

		// // manually update the entity bounds as we manually change the position
		// this.updateBounds();

		// // to remember which side we were walking
		// this.walkLeft = false;

		// // walking & jumping speed
		// this.body.setVelocity(4, 6);
	// },
	
		
	// onCollision : function (res, obj)
	// {
			
		// // res.y >0 means touched by something on the bottom
		// // which mean at top position for this one
		// if (this.alive && (res.y > 0) && obj.falling)
		// {
			// this.renderable.flicker(750);
		// }
	// },

	
	// // manage the enemy movement
	// update : function (dt)
	// {			
		// if (this.alive)
		// {
			// if (this.walkLeft && this.pos.x <= this.startX)
			// {
				// this.walkLeft = false;
			// }
			// else if (!this.walkLeft && this.pos.x >= this.endX)
			// {
				// this.walkLeft = true;
			// }
			
			// this.flipX(this.walkLeft);
			// this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;

		// }
		// else
		// {
			// this.body.vel.x = 0;
		// }
		// // check & update movement
		// this.body.update(dt);
			
		// if (this.body.vel.x!=0 ||this.body.vel.y!=0)
		// {
			// // update the object animation
			// this._super(me.Entity, 'update', [dt]);
			// return true;
		// }
		// return false;
	// }
// });
