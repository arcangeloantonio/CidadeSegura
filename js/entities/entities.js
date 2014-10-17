game.PlayerEntity = me.Entity.extend(
{
	init:function (x, y, settings)
	{
		settings.width = 32;
		settings.height = 32;
		
		this.angle = 0;
		this._super(me.Entity, 'init', [x, y , settings]);
		this.body.setVelocity(3, 3);
		this.speed = 0;
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		this.alwaysUpdate = true;
		
		this.somAcelerando = false;
		this.tempoAcelerando = 0;
		this.tempoRe = 0;
		
	},
	draw: function(ctx) {
		var context = ctx.getContext();
		var carro = me.loader.getImage("player"); 
		
		var raio = 48;
		
		context.save();
		context.translate(this.pos.x+16, this.pos.y+16);
		context.rotate(this.angle);
		context.drawImage(carro,-carro.width/2,-carro.width/2);
		context.restore();
		
		var seta = me.loader.getImage("arrow"); 
		
		var entidadePassageiro = me.game.world.getChildByName("passagerEntity")[0];
		entidadePassageiro.update();
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
		
		if (me.input.keyStatus('up') != true) {
			me.audio.stop("car_accel");
			this.tempoAcelerando = 0;
		}
		if (me.input.keyStatus('down') != true) {
			me.audio.stop("car_stop");
			this.tempoRe = 0;
		}
		
		
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
				if (this.speed < 0) this.speed = 0;
				if (this.tempoAcelerando <= me.timer.getTime() || this.tempoAcelerando == 0) {
					me.audio.stop("car_stop");
					me.audio.playTrack("car_accel", false, null, 0.1);
					this.tempoAcelerando  = me.timer.getTime() + 6000;
				}			
				
				this.speed += 0.05;
				this.body.vel.x = Math.sin(this.angle) * this.speed * me.timer.tick;
				this.body.vel.y = -Math.cos(this.angle) * this.speed * me.timer.tick;
			}
			if (me.input.isKeyPressed("down")) {
				if (this.speed > 0) this.speed = 0;
				if (this.tempoRe <= me.timer.getTime() || this.tempoRe == 0) {
					me.audio.stop("car_accel");
					me.audio.play("car_stop", false);
					this.tempoRe  = me.timer.getTime() + 3000;
				}	
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

		 if (this.body.vel.x!=0 || this.body.vel.y!=0 && !this.colidiu)
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
		
		this.tempoMudaFarol = Math.floor((Math.random() * 5)+3);
		
		
		this.tempo = 0;
		this.pontuou = false;
	},
	update : function ()
	{
		this.tempoAtual = me.timer.getTime();
		if (this.tempoAtual - this.tempoInicial >= (this.tempoMudaFarol*1000)) {
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
						game.data.money -= 191.54;
						game.data.score += 7;
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
		this.z = 6;
		me.collision.check(this, true, this.collideHandler.bind(this), true);
	},
	collideHandler : function (response) {
		if (response.b.name == 'mainplayer') {
			if (this.tempo == 0) this.tempo = me.timer.getTime()+4000;
			if (me.timer.getTime() >= this.tempo) {
				game.data.money -= 127.69;
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
		this.updateBounds();
		me.collision.check(this, true, this.collideHandler.bind(this), true);
		
	},
	collideHandler : function (response) {
		if (response.b.name == 'mainplayer') {
			if (this.renderable.isCurrentAnimation("passager")) {
				this.renderable.setCurrentAnimation("point", function(){self.renderable.setCurrentAnimation("point"); self.status = "OK";})
				game.data.balaoFala = game.tipoFala.PEGOU;
			}
			else {
				this.renderable.setCurrentAnimation("passager", function(){self.renderable.setCurrentAnimation("passager"); self.status = "OK";})
				game.data.balaoFala = game.tipoFala.DEIXOU;
				game.data.money += 50;
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
		
		var colors = ["white_b", "white_y",  "red_b",  "red_y", "blue_b", "blue_y", "green_b", "green_y", "grey_b", "grey_y"];
		var feet_left = '_l';
		var feet_right = '_r';
		
		this.renderable.addAnimation(colors[0] + feet_left, [0]);
		this.renderable.addAnimation(colors[0] + feet_right, [1]);
		this.renderable.addAnimation(colors[1] + feet_left, [2]);
		this.renderable.addAnimation(colors[1] + feet_right, [3]);
		this.renderable.addAnimation(colors[2] + feet_left, [4]);
		this.renderable.addAnimation(colors[2] + feet_right, [5]);
		this.renderable.addAnimation(colors[3] + feet_left, [6]);
		this.renderable.addAnimation(colors[3] + feet_right, [7]);
		this.renderable.addAnimation(colors[4] + feet_left, [8]);
		this.renderable.addAnimation(colors[4] + feet_right, [9]);
		this.renderable.addAnimation(colors[5] + feet_left, [10]);
		this.renderable.addAnimation(colors[5] + feet_right, [11]);
		this.renderable.addAnimation(colors[6] + feet_left, [12]);
		this.renderable.addAnimation(colors[6] + feet_right, [13]);
		this.renderable.addAnimation(colors[7] + feet_left, [14]);
		this.renderable.addAnimation(colors[7] + feet_right, [15]);
		this.renderable.addAnimation(colors[8] + feet_left, [16]);
		this.renderable.addAnimation(colors[8] + feet_right, [17]);
		this.renderable.addAnimation(colors[9] + feet_left, [18]);
		this.renderable.addAnimation(colors[9] + feet_right, [19]);
			
		var self = this;
		
		var corDefinida = Math.floor((Math.random() * 10) );
		
		this.spriteDefinidoDireita = colors[corDefinida] + feet_right;
		this.spriteDefinidoEsquerda = colors[corDefinida] + feet_left;
		
		this.renderable.setCurrentAnimation(this.spriteDefinidoDireita);
		
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
			if (this.renderable.isCurrentAnimation(this.spriteDefinidoEsquerda)) {
				this.renderable.setCurrentAnimation(this.spriteDefinidoDireita);
			}
			else {
				this.renderable.setCurrentAnimation(this.spriteDefinidoEsquerda);
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
		else if (response.b.name == 'mainplayer') {
			game.data.score = 21;
		}
	}
});

game.EnemyEntity = me.Entity.extend(
{
	init: function (x, y, settings)
	{		
		var width = settings.width;
		var height = settings.height;

		settings.spritewidth = settings.width = 32;
		settings.spriteheight = settings.height = 64;
		
		settings.height = 32;
		
		this._super(me.Entity, 'init', [x, y , settings]);

		
		var colors = ["grey", "red",  "green",  "bluedark", "orange", "bluelight", "white", "purple", "pink", "yellow"];
		
		this.renderable.addAnimation(colors[0], [0]);
		this.renderable.addAnimation(colors[1], [1]);
		this.renderable.addAnimation(colors[2], [2]);
		this.renderable.addAnimation(colors[3], [3]);
		this.renderable.addAnimation(colors[4], [4]);
		this.renderable.addAnimation(colors[5], [5]);
		this.renderable.addAnimation(colors[6], [6]);
		this.renderable.addAnimation(colors[7], [7]);
		this.renderable.addAnimation(colors[8], [8]);
		this.renderable.addAnimation(colors[9], [9]);
		
		var self = this;
		
		var corDefinida = Math.floor((Math.random() * 10) );
		
		this.renderable.setCurrentAnimation(colors[corDefinida], function(){self.renderable.setCurrentAnimation(colors[corDefinida]); self.status = "OK";})
		
		x = this.pos.x;
		this.startX = x;
		this.endX   = x + width - settings.spritewidth
		this.pos.x  = x + width - settings.spritewidth;

		y = this.pos.y;
		this.startY = y;
		this.endY   = y + height - 32;
		this.pos.y  = y + height - settings.spriteheight;

		this.updateBounds();

		this.alwaysUpdate = true;
		this.body.setVelocity(4, 4);
		this.parado = false;
		this.direcao = settings.direcao;
	},
	update : function (dt)
	{
		var yTopo = this.pos.y <= this.startY;
		var yBaixo = this.pos.y >= this.endY;
		
		var xEsquerda = this.pos.x <= this.startX;
		var xDireita = this.pos.x >= this.endX;
		
		var andarCima = false;
		var andarBaixo = false;
		var andarDireita = false;
		var andarEsquerda = false;
		
		if (this.direcao === 'e') {
			andarCima = !yTopo && xDireita;
			andarEsquerda = yTopo && !xEsquerda;
			andarBaixo = !yBaixo && xEsquerda;
			andarDireita = yBaixo && !xDireita;
		}
		else {
			andarEsquerda = yBaixo && !xEsquerda;
			andarCima = !yTopo && xEsquerda;
			andarDireita = yTopo && !xDireita;
			andarBaixo = !yBaixo && xDireita;
		}
		if (andarEsquerda) {
			this.body.vel.x -= this.body.accel.x * me.timer.tick;
			this.renderable.angle = (270 * (Math.PI/180));
		}
		else {
			if (!andarDireita) this.body.vel.x = 0;
		}
		
		if (andarDireita) {
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			this.renderable.angle = (90 * (Math.PI/180));
		}
		else {
			if (!andarEsquerda) this.body.vel.x = 0;
		}
		
		if (andarCima) {
			if (!andarBaixo) this.body.vel.y -= this.body.accel.y * me.timer.tick;
			this.renderable.angle = (0 * (Math.PI/180));
		}
		else {
			this.body.vel.y = 0;
		}
		
		if (andarBaixo) {
			this.body.vel.y += this.body.accel.y * me.timer.tick;
			this.renderable.angle = (180 * (Math.PI/180));
		}
		else {
			if (!andarCima) this.body.vel.y = 0;
		}
		
		me.collision.check(this, true, this.collideHandler.bind(this), true);
		
		//if (!this.parado) {
			this.body.update(dt);
		//}
		
		if (this.body.vel.x!=0 ||this.body.vel.y!=0)
		{
			this._super(me.Entity, 'update', [dt]);
			return true;
		}
		return false;
	},
	collideHandler: function(response) {
		if (response.b.name == 'trafficlightentity') {
			if (response.b.renderable.isCurrentAnimation("red") && ((response.overlapN.y == 1 && response.overlapN.x == 0) || (response.overlapN.y == 0 && response.overlapN.x == 1))) {
				this.parado = true;
			}
			else {
				this.parado = false;
			}
		}
		else if (response.b.name === "mainplayer") {
			response.b.body.vel.x = 0;
			response.b.body.vel.y = 0;
			response.b.body.accel.x = 0;
			response.b.body.accel.y = 0;
			this.body.setVelocity(0, 0);
			if (!me.input.isKeyPressed("down")) {
				response.b.speed = 0;				
			}
			
			if (response.b.speed != 0) {
				this.body.setVelocity(4, 4);
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
				game.data.money -= 86.13
				game.data.score += 4;
				this.tempo = 0;
			}
		}
	}
});

// game.VelocityEntity = me.Entity.extend(
// {
	// init:function (x, y, settings)
	// {
		// this._super(me.Entity, 'init', [x, y , settings]);
	// },
	// update: function() {
		// me.collision.check(this, true, this.collideHandler.bind(this), true);
	// },
	// collideHandler : function (response) {
		 // if (response.b.name == 'mainplayer') {
			 // if (this.tempo == 0) this.tempo = me.timer.getTime()+4000;
				// if (me.timer.getTime() >= this.tempo) {
					// var velocidade = Math.abs((Math.round(response.b.speed * 10)/10) * 10);
					// //if (20%) {}
					// //game.data.score += 4;
					// //game.data.money -= 86,13;
					// //if (50%) {}
					// //game.data.score += 7;
					// //game.data.money -= 574,60;
				// this.tempo = 0;
			// // }
		// // }
	// }
// });

// game.OtherHandEntity = me.Entity.extend(
// {
	// init:function (x, y, settings)
	// {
		// this._super(me.Entity, 'init', [x, y , settings]);
	// },
	// update: function() {
		// me.collision.check(this, true, this.collideHandler.bind(this), true);
	// },
	// collideHandler : function (response) {
		// // if (response.b.name == 'mainplayer') {
			// // if (this.tempo == 0) this.tempo = me.timer.getTime()+4000;
			// // if (me.timer.getTime() >= this.tempo) {
				// // //85,12
				// // game.data.score += 4;
				// // this.tempo = 0;
			// // }
		// // }
	// }
// });

// game.SideWalkEntity = me.Entity.extend(
// {
	// init:function (x, y, settings)
	// {
		// this._super(me.Entity, 'init', [x, y , settings]);
	// },
	// update: function() {
		// me.collision.check(this, true, this.collideHandler.bind(this), true);
	// },
	// collideHandler : function (response) {
		// // if (response.b.name == 'mainplayer') {
			// // if (this.tempo == 0) this.tempo = me.timer.getTime()+4000;
			// // if (me.timer.getTime() >= this.tempo) {
				// // //85,12
				// // game.data.score += 4;
				// // this.tempo = 0;
			// // }
		// // }
	// }
// });