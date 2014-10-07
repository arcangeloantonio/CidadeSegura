//TODO
// HUD Caixa de Diálogo
// Pausa +/-
// Resto dos menus
// Sons
// Sprite carro

game.PlayerEntity = me.Entity.extend(
{
	init:function (x, y, settings)
	{
		settings.width = 32;
		settings.height = 48;
		
		this.angle = 0;
		this._super(me.Entity, 'init', [x, y , settings]);
		this.body.setVelocity(3, 3);
		this.speed = 0;
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		this.alwaysUpdate = true;
	},
	draw: function(ctx) {
		var context = ctx.getContext();
		var carro = me.loader.getImage("car"); 
		
		var raio = 48;
		
		context.save();
		context.translate(this.pos.x+16, this.pos.y+16);
		context.rotate(this.angle);
		context.drawImage(carro,-carro.width/2,-carro.width/2);
		context.restore();
		
		var seta = me.loader.getImage("arrow"); 
		
		var entidadePassageiro = me.game.world.getChildByName("passagerEntity")[0];
		var anguloPassageiro = this.angleTo(entidadePassageiro) +  (90 * (Math.PI/180));
		
		context.save();
		context.translate((this.pos.x+16) + raio * 0.9 * Math.cos(anguloPassageiro), (this.pos.y+32) + raio * 0.9 * Math.sin(anguloPassageiro));
		
		context.rotate(anguloPassageiro);
		context.drawImage(seta, -seta.width*0.75, -seta.height * 0.5);
		
		context.setTransform(1,0,0,1,0,0);
		context.restore();		
	},
	update : function (dt)
	{
		this.z = 99;
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
		
		this.renderable.angle = this.angle;
		this.body.update(dt);

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
		this.alwaysUpdate = true;
		
		this.tempo = 0;
		this.pontuou = false;
	},
	update : function ()
	{
		this.tempoAtual = me.timer.getTime();
		if (this.tempoAtual - this.tempoInicial >= 1000) {
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
				if (this.tempo == 0) this.tempo = me.timer.getTime()+1000;
				if (this.renderable.isCurrentAnimation('red')) {
					if (me.timer.getTime() <= this.tempo && !this.pontuou) {
						game.data.score += 3;
						this.pontuou = true;
					}
					else if (me.timer.getTime() > this.tempo) {
						this.pontuou = false;
						this.tempo = 0;
					}
				}
			}
	}
});

game.PedestrianLightEntity = me.Entity.extend(
{
	init:function (x, y, settings)
	{
		this._super(me.Entity, 'init', [x, y , settings]);
        this.renderable.addAnimation("red", [0]);
		this.renderable.addAnimation("green", [1]);

		var self = this;
		this.renderable.setCurrentAnimation("red", function(){self.renderable.setCurrentAnimation("red"); self.status = "OK";})
		this.alwaysUpdate = true;
	},
	update : function ()
	{
		me.collision.check(this, true, this.collideHandler.bind(this), true);
	},
	collideHandler : function (response) {
		if (response.b.name == 'trafficlightentity') {
			var trafficlight = response.b;
			if (response.b.renderable.isCurrentAnimation("green")) {
					response.a.renderable.setCurrentAnimation("red", function(){this.renderable.setCurrentAnimation("red"); this.status = "OK";});
				}
			else {
				response.a.renderable.setCurrentAnimation("green", function(){this.renderable.setCurrentAnimation("green"); this.status = "OK";});
			}
		}
	}
});

game.BusRoadEntity = me.Entity.extend(
{
	init:function (x, y, settings)
	{
		this._super(me.Entity, 'init', [x, y , settings]);
		this.alwaysUpdate = true;
		this.tempo = 0;
	},
	update: function() {
		this.z = 7;
		me.collision.check(this, true, this.collideHandler.bind(this), true);
	},
	collideHandler : function (response) {
		if (response.b.name == 'mainplayer') {
			if (this.tempo == 0) this.tempo = me.timer.getTime()+4000;
			if (me.timer.getTime() >= this.tempo) {
				me.audio.play("cling");
				game.data.score += 5;
				this.tempo = 0;
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
		var width = settings.width;
		var height = settings.height;;

		settings.spritewidth = settings.width = 32;
		settings.height = settings.height = 32;

		this._super(me.Entity, 'init', [x, y , settings]);

		x = this.pos.x;
		this.startX = x;
		this.endX   = x + width - settings.spritewidth
		this.pos.x  = x + width - settings.spritewidth;

		y = this.pos.y;
		this.startY = y;
		this.endY   = y + height - settings.spritewidth;
		this.pos.y  = y + height - settings.spritewidth;

		this.updateBounds();

		this.auxX = true;
		this.auxY = true;
		
		this.stopX = true;
		this.stopY = false;

		this.alwaysUpdate = true;
		this.body.setVelocity(2,2);
		
		this.renderable.addAnimation("left", [0]);
		this.renderable.addAnimation("right", [1]);

		var self = this;
		this.renderable.setCurrentAnimation("left", function(){self.renderable.setCurrentAnimation("left"); self.status = "OK";})
		
		this.pixelsAndados = 0;
		this.parado = false;
		
	},
	update: function(dt)
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
				this.pixelsAndados = 0;
			}
			else {
				if (this.pos.x < this.endX) {
					this.body.vel.y += this.body.accel.y * me.timer.tick;
					this.renderable.angle = (180 * (Math.PI/180));
				}
				if (this.pos.x > this.startX) {
					this.body.vel.y -= this.body.accel.y * me.timer.tick;
					this.renderable.angle = (360 * (Math.PI/180));
				}
				this.pixelsAndados += this.body.accel.y;
			}
		}
		
		if (this.stopY) {
			if (this.stopX && this.auxY) {
				this.body.vel.x = 0;
				this.stopY = false;
				this.auxY = false;
				this.pixelsAndados = 0;
			}
			else {
				this.renderable.angle = (90 * (Math.PI/180)); //Gambiarra para funcionar
				// if (this.pos.y > this.endY) {
					// this.body.vel.x += this.body.accel.x * me.timer.tick;
					
				// }
				if (this.pos.y < this.startY) {
					this.body.vel.x -= this.body.accel.x * me.timer.tick;
					this.renderable.angle = (270 * (Math.PI/180));					
				}
				this.pixelsAndados += this.body.accel.x;
			}
		}		
		me.collision.check(this, true, this.collideHandler.bind(this), true);
		
		var self = this;
		if (this.pixelsAndados >= 32 && !this.parado) {
			if (this.renderable.isCurrentAnimation("left")) {
				this.renderable.setCurrentAnimation("right", function(){self.renderable.setCurrentAnimation("left"); self.status = "OK";})
			}
			else {
				this.renderable.setCurrentAnimation("left", function(){self.renderable.setCurrentAnimation("left"); self.status = "OK";})
			}
			this.pixelsAndados = 0;
		}
		
		this.body.update(dt);

		if (this.body.vel.x!=0 ||this.body.vel.y!=0)
		{
			this._super(me.Entity, 'update', [dt]);
			return true;
		}
		return false;
	},
	collideHandler : function (response) {
		
		if (response.b.name == 'pedestrianlightentity') {
			if (response.b.renderable.isCurrentAnimation("red") && response.overlapN.y == 1 && response.overlapN.x == 0) {
				response.a.body.vel.y = 0;
				response.a.body.vel.x = 0;
				this.parado = true;
			}
			else {
				if (this.stopX) response.a.body.vel.y = 2;
				if (this.stopY) response.a.body.vel.x = 2;
				this.parado = false;
			}
		}
	},
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
		this.parado = false;
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
		
		me.collision.check(this, true, this.collideHandler.bind(this), true);
		
		if (!this.parado) {
			this.body.update(dt);
		}
		
		if (this.body.vel.x!=0 ||this.body.vel.y!=0)
		{
			this._super(me.Entity, 'update', [dt]);
			return true;
		}
		return false;
	},
	collideHandler: function(response) {
		if (response.b.name == 'trafficlightentity') {
			if (response.b.renderable.isCurrentAnimation("red") && response.overlapN.y == 1 && response.overlapN.x == 0) {
				this.parado = true;
			}
			else {
				this.parado = false;
			}
		}
	}
});


game.StopEntity = me.Entity.extend(
{
	init:function (x, y, settings)
	{
		this._super(me.Entity, 'init', [x, y , settings]);
		this.alwaysUpdate = true;
		this.tempo = 0;
	},
	update: function() {
		me.collision.check(this, true, this.collideHandler.bind(this), true);
	},
	collideHandler : function (response) {
		if (response.b.name == 'mainplayer') {
			if (this.tempo == 0) this.tempo = me.timer.getTime()+4000;
			if (me.timer.getTime() >= this.tempo) {
				me.audio.play("cling");
				game.data.score += 5;
				this.tempo = 0;
			}
		}
	}
});
