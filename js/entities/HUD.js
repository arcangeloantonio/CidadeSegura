game.HUD = game.HUD || {};
 
game.HUD.Container = me.Container.extend({
	init: function() {
		this._super(me.Container, 'init');
		this.isPersistent = true;
		this.z = Infinity;
		this.name = "HUD";
		
		this.addChild(new game.HUD.ScoreItem(460, 570));
		this.addChild(new game.HUD.Velocity(10, 550));
		this.addChild(new game.HUD.Money(10,0));
		this.addChild(new game.HUD.Time(550, 0));
	}
});

game.HUD.ScoreItem = me.Renderable.extend( {	
	init: function(x, y) {
		this._super(me.Renderable, 'init', [x, y, 10, 10]); 
		this.score = -1;
		this.floating = true;
	},
	update : function () {
		if (this.score !== game.data.score) {	
			this.score = game.data.score;
			return true;
		}
		return false;
	},
	draw : function (ctx) {
		var context = ctx.getContext();
		this.font = new me.Font("Burnstown", 30, '#000000');
		this.font.bold();
		this.font.draw(context, 'Pontos na carteira: ' + game.data.score + '/20', this.pos.x, this.pos.y);
	}
});

game.HUD.Velocity = me.Renderable.extend( {	
	init: function(x, y) {
		this._super(me.Renderable, 'init', [x, y, 10, 10]); 
		this.velocidade = -1;
		this.floating = true;
	},
	update : function () {
		var entidadeJogador = me.game.world.getChildByName("mainPlayer")[0];
		var _velocidade = Math.abs((Math.round(entidadeJogador.speed * 10)/10) * 10);
		var velocidade = (_velocidade < 10 ? 0 : _velocidade).toString() + ' KM/H';
		if (this.velocidade !== velocidade) {	
			this.velocidade = velocidade;
			return true;
		}
		return false;
	},
	draw : function (ctx) {
		var context = ctx.getContext();
		this.font = new me.Font("Burnstown", 50, '#000000');
		this.font.bold();
		this.font.draw (context, this.velocidade, this.pos.x, this.pos.y);
	}
});

game.HUD.Money = me.Renderable.extend( {	
	init: function(x, y) {
		this._super(me.Renderable, 'init', [x, y, 10, 10]); 
		this.money = 1000;
		this.floating = true;
	},
	update : function () {
		return true;
	},
	draw : function (ctx) {
		var context = ctx.getContext();
		this.font = new me.Font("Burnstown", 50, '#000000');
		this.font.bold();
		this.font.draw(context, 'R$: ' + this.money, this.pos.x, this.pos.y);
	}
});

game.HUD.Time = me.Renderable.extend( {	
	init: function(x, y) {
		this._super(me.Renderable, 'init', [x, y, 10, 10]); 
		this.font = new me.BitmapFont("32x32_font", 32);
		this.font.set("right");
		this.floating = true;
		this.initialTime = me.timer.getTime();
	},
	update : function () {
		return true;
		
	},
	draw : function (ctx) {
		var context = ctx.getContext();
		var tempo = Math.round((me.timer.getTime()-this.initialTime)/1000);	
		this.font = new me.Font("Burnstown", 50, '#000000');
		this.font.bold();
		this.font.draw(context, 'Tempo: ' + tempo, this.pos.x, this.pos.y);
	}
});