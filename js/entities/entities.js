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
				this.angle -= 0.02 * this.speed;
			}
			if (me.input.isKeyPressed("right")) {
				this.angle += 0.02 * this.speed;
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
	//,http://agmprojects.com/blog/rendering-shapes-and-drawings-via-the-canvas-in-melonjs
	
	// draw: function(context) {
		// context.fillStyle = 'green';
		// context.fillRect(20, 20, 20, 20);
	// },
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
	},
	update: function() {
		me.collision.check(this, true, this.collideHandler.bind(this), true);
	},
	collideHandler : function (response) {
		if (response.b.name == 'mainplayer') {
			this.tempoAtual = me.timer.getTime();
			if (this.tempoAtual >= 10000) {
				this.tempoInicial = this.tempoAtual;
				me.audio.play("cling");
				game.data.score += 250;
			}
		}
	}
});

game.ArrowEntity = me.Entity.extend(
{
	init: function (x, y, settings)
	{
		this._super(me.Entity, 'init', [x, y , settings]);
		
		var self = this;
		this.renderable.addAnimation("arrow", [0]);
		this.renderable.setCurrentAnimation("arrow", function(){self.renderable.setCurrentAnimation("point"); self.status = "OK";})
	},
	update: function() {			
		var entidadeJogador = me.game.world.getChildByName("mainPlayer")[0];
		var entidadePassageiro = me.game.world.getChildByName("passagerEntity")[0];
		var angle = this.angleTo(entidadePassageiro) +  (90 * (Math.PI/180));
	
		this.renderable.angle = angle;
		this.pos.x = entidadeJogador.pos.x;
		this.pos.y = entidadeJogador.pos.y;
		this.body.pos.x = entidadeJogador.pos.x;
		this.body.pos.y = entidadeJogador.pos.y;
		
		this.pos.sub({x: entidadeJogador.pos.x, y: entidadeJogador.pos.y});
		this.updateBounds();
		//this.body.update();
	}
});

game.PassagerEntity = me.Entity.extend(
{
	init: function (x, y, settings)
	{
		var tileSortido = this.obterTileCalcada();
		this._super(me.Entity, 'init', [tileSortido.pos.x, tileSortido.pos.y , settings]);

		this.body.getShape().setShape(0, 0, [
			new me.Vector2d(0, 0), new me.Vector2d(this.width, 0),
			new me.Vector2d(this.width, this.height), new me.Vector2d(0, this.height)
		]);
		
		this.renderable.addAnimation("passager", [0]);
		this.renderable.addAnimation("point", [1]);

		var self = this;
		this.renderable.setCurrentAnimation("passager", function(){self.renderable.setCurrentAnimation("passager"); self.status = "OK";})
	},
	update: function(dt) {
		this.body.update();
		me.collision.check(this, true, this.collideHandler.bind(this), true);
		
	},
	collideHandler : function (response) {
		if (response.b.name == 'mainplayer') {
			if (this.renderable.isCurrentAnimation("passager")) {
				this.renderable.setCurrentAnimation("point", function(){self.renderable.setCurrentAnimation("point"); self.status = "OK";})
			}
			else {
				this.renderable.setCurrentAnimation("passager", function(){self.renderable.setCurrentAnimation("passager"); self.status = "OK";})
			}
			
			var tileSortido = this.obterTileCalcada();
			
			this.pos.x = tileSortido.pos.x;
            this.pos.y = tileSortido.pos.y;
			this.body.pos.x = tileSortido.pos.x;
			this.body.pos.y = tileSortido.pos.y;
			
			this.pos.sub({x: tileSortido.pos.x, y: tileSortido.pos.y});
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

game.PedestrianEntity  = me.Entity.extend(
{
	init: function (x, y, settings)
	{
		this._super(me.Entity, 'init', [x, y , settings]);
	}
});

game.EnemyEntity = me.Entity.extend(
{
	init: function (x, y, settings)
	{
		var width = settings.width;
		var height = settings.height;;

		settings.spritewidth = settings.width = 32;
		settings.spritewidth = settings.height = 32;

		this._super(me.Entity, 'init', [x, y , settings]);

		x = this.pos.x;
		this.startX = x;
		this.endX   = x + width - settings.spritewidth
		this.pos.x  = x + width - settings.spritewidth;

		y = this.pos.y;
		this.startY = y+6;
		this.endY   = y + height - settings.spritewidth;
		this.pos.y  = y + height - settings.spritewidth;

		this.updateBounds();

		this.auxX = true;
		this.auxY = true;
		
		this.stopX = true;
		this.stopY = false;

		this.alwaysUpdate = true;
		this.body.setVelocity(4, 4);
	},
	update : function (dt)
	{
		if (!this.stopY && (this.pos.y >= this.endY || this.pos.y <= this.startY))
		{
			this.stopY = true;
			this.auxX = true;
		}
		
		if (!this.stopX && (this.pos.x >= this.endX || this.pos.x <= this.startX)) {
			this.stopX = true;
			this.auxY = true;
		}
		
		
		if (this.stopX) {
			if (this.stopY && this.auxX) {
				this.body.vel.y = 0;
				this.stopX = false;
				this.auxX = false;
			}
			else {
				if (this.pos.x < this.endX) {
					this.body.vel.y += this.body.accel.y * me.timer.tick;
					this.renderable.angle = 3.1;
				}
				if (this.pos.x > this.startX) {
					this.body.vel.y -= this.body.accel.y * me.timer.tick;
					this.renderable.angle = 0;
				}
			}
		}
		
		if (this.stopY) {
			if (this.stopX && this.auxY) {
				this.body.vel.x = 0;
				this.stopY = false;
				this.auxY = false;
			}
			else {
				if (this.pos.y > this.endY) {
					this.body.vel.x += this.body.accel.x * me.timer.tick;
					this.renderable.angle = 1.6;
				}
				if (this.pos.y < this.startY) {
					this.body.vel.x -= this.body.accel.x * me.timer.tick;
					this.renderable.angle = 4.7;
				}
			}
		}
		this.body.update(dt);

		if (this.body.vel.x!=0 ||this.body.vel.y!=0)
		{
			this._super(me.Entity, 'update', [dt]);
			return true;
		}
		return false;
	}
});
