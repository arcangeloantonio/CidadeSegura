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
	}
});

game.TrafficLightEntity = me.Entity.extend(
{
	init:function (x, y, settings)
	{
		this._super(me.Entity, 'init', [x, y , settings]);

		this.tempoInicial = me.timer.getTime();

        this.renderable.addAnimation("red", [0]);
		this.renderable.addAnimation("green", [1]);

		var self = this;
		this.renderable.setCurrentAnimation("red", function(){self.renderable.setCurrentAnimation("red"); self.status = "OK";})

	},
	update : function ()
	{
		this.tempoAtual = me.timer.getTime();
		if (this.tempoAtual - this.tempoInicial >= 750) {
			this.tempoInicial = this.tempoAtual;
			if (this.renderable.isCurrentAnimation("green")) {
				this.renderable.setCurrentAnimation("red", function(){this.renderable.setCurrentAnimation("red"); this.status = "OK";});
			}
			else {
				this.renderable.setCurrentAnimation("green", function(){this.renderable.setCurrentAnimation("green"); this.status = "OK";});
			}
		}
		me.collision.check(this, true, this.collideHandler.bind(this), true);
	},
	collideHandler : function (response) {
 			if (response.b.name == 'mainplayer') {
				if (this.renderable.isCurrentAnimation('red')) {
					game.data.score += 250;
				}
			}
	}
});

game.BusRoadEntity = me.Entity.extend(
{
	init:function (x, y, settings)
	{
		this._super(me.Entity, 'init', [x, y , settings]);
		this.tempoInicial = me.timer.getTime();
	},
	update: function() {
		me.collision.check(this, true, this.collideHandler.bind(this), true);
	},
	collideHandler : function (response) {
		if (response.b.name == 'mainplayer') {
			this.tempoAtual = me.timer.getTime();
			if (this.tempoAtual - this.tempoInicial >= 10000) {
				this.tempoInicial = this.tempoAtual;
				me.audio.play("cling");
				game.data.score += 250;
			}
		}
	}
});


game.PassagerEntity = me.Entity.extend(
{
	init: function (x, y, settings)
	{
		var tileSortido = this.obterTileCalcada();
		this._super(me.Entity, 'init', [tileSortido.pos.x, tileSortido.pos.y , settings]);

		this.renderable.addAnimation("passager", [0]);
		this.renderable.addAnimation("point", [1]);

		var self = this;
		this.renderable.setCurrentAnimation("passager", function(){self.renderable.setCurrentAnimation("passager"); self.status = "OK";})

		this.alwaysUpdate = true;
		this.type = me.game.ENEMY_OBJECT;
	},
	update: function(dt) {
		me.collision.check(this, true, this.collideHandler.bind(this), true);
			console.log(this.entity);
	},
	collideHandler : function (response) {
		if (response.b.name == 'mainplayer') {
			/*if (this.renderable.isCurrentAnimation("passager")) {
				this.renderable.setCurrentAnimation("point", function(){self.renderable.setCurrentAnimation("point"); self.status = "OK";})
			}
			else {
				this.renderable.setCurrentAnimation("passager", function(){self.renderable.setCurrentAnimation("passager"); self.status = "OK";})
			}
			*/

			var tileSortido = this.obterTileCalcada();

			this.pos.x = tileSortido.pos.x;
			this.pos.y = tileSortido.pos.y;
			this.body.x = tileSortido.pos.x;
			this.body.y = tileSortido.pos.y;
			this.bounds.pos.x = tileSortido.pos.x;
			this.bounds.pos.y = tileSortido.pos.y;
			this.renderable.pos.x = tileSortido.pos.x;
			this.renderable.pos.y = tileSortido.pos.y;
			this.updateBounds();

		}
	},
	obterTilesPreenchidos: function() {
		var camadaTiles = me.game.currentLevel.getLayerByName("sidewalk").layerData;
		var tilesPreenchidos = []
		for (var i = 0; i < camadaTiles.length; i++) {
			var colunas = camadaTiles[i];
			for (var j = 0; j < colunas.length; j++) {
				if (colunas[j] != null) {
					tilesPreenchidos.push(colunas[j]);
				}
			}
		}
		return tilesPreenchidos;
	},
	obterTileCalcada: function() {
		var tilesPreenchidos = this.obterTilesPreenchidos();
		return tilesPreenchidos[Math.floor(Math.random() * tilesPreenchidos.length)];

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
