game.HUD = game.HUD || {};
 
game.HUD.Container = me.Container.extend({
	init: function() {
		this._super(me.Container, 'init');
		this.isPersistent = true;
		this.z = Infinity;
		this.name = "HUD";
		
		this.addChild(new game.HUD.ScoreItem(790, 560));
		this.addChild(new game.HUD.Velocity(250, 560));
	}
});

game.HUD.ScoreItem = me.Renderable.extend( {	
	init: function(x, y) {
		this._super(me.Renderable, 'init', [x, y, 10, 10]); 
		this.font = new me.BitmapFont("32x32_font", 32);
		this.font.set("right");
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
	draw : function (context) {
		this.font.draw (context, game.data.score, this.pos.x, this.pos.y);
	}
});

game.HUD.Velocity = me.Renderable.extend( {	
	init: function(x, y) {
		this._super(me.Renderable, 'init', [x, y, 10, 10]); 
		this.font = new me.BitmapFont("32x32_font", 32);
		this.font.set("right");
		this.velocidade = -1;
		this.floating = true;
	},
	update : function () {
		var entidadeJogador = me.game.world.getChildByName("mainPlayer")[0];
		var velocidade = Math.abs((Math.round(entidadeJogador.speed * 10)/10) * 10).toString() + ' KM/H';
		if (this.velocidade !== velocidade) {	
			this.velocidade = velocidade;
			return true;
		}
		return false;
	},
	draw : function (context) {
		this.font.draw (context, this.velocidade, this.pos.x, this.pos.y);
	}
});
