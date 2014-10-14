game.HUD = game.HUD || {};
 
game.HUD.Container = me.Container.extend({
	init: function() {
		this._super(me.Container, 'init');
		this.isPersistent = true;
		this.z = Infinity;
		this.name = "HUD";
		
		this.addChild(new game.HUD.Speak(0, 0));
		this.addChild(new game.HUD.ScoreItem(460, 570));
		this.addChild(new game.HUD.Velocity(10, 550));
		this.addChild(new game.HUD.Money(10,0));
		this.addChild(new game.HUD.Time(550, 0));
	}
});

game.HUD.Speak = me.Renderable.extend( {
	init: function(x, y) {
		this._super(me.Renderable, 'init', [x, y, 10, 10]); 
		this.floating = true;
		this.tempo = 0;
		this.falasPegou = ['Por favor, leve-me até meu destino!', 'Rápido, preciso chegar na outra zona da cidade!',  'Leve-me para próximo a minha casa!'];
		this.falasDeixou = ['Obrigado!', 'Foi uma ótima corrida!',  'Você é um ótimo motorista!'];
		this.fala = '';
	},
	update : function () {
		return true;
	},
	draw : function (ctx) {
		if (game.data.balaoFala != game.tipoFala.NENHUM) {
			if (this.tempo == 0) this.tempo = me.timer.getTime()+2000;
			if (this.tempo >= me.timer.getTime()) {
				if (this.fala == '') {
					switch (game.data.balaoFala) {
						case game.tipoFala.PEGOU:
							this.fala = this.falasPegou[Math.floor((Math.random() * 3))];
							break;
						case game.tipoFala.DEIXOU:
							this.fala = this.falasDeixou[Math.floor((Math.random() * 3))];
							break;
					}
				}
				var context = ctx.getContext();
				context.beginPath();
				context.rect(10, 445, 780 , 150);
				context.fillStyle = 'rgba(0,0,0,0.5)';
				context.fill();
				context.lineWidth = 7;
				context.strokeStyle = '#99C6E0';
				context.stroke();
				context.drawImage(me.loader.getImage("rosto"), 30, 455);
				this.font = new me.Font("Burnstown", 30, '#99C6E0');
				this.font.draw(context, this.fala, 190, 500);
			}
			else {
				this.tempo = 0;
				game.data.balaoFala = game.tipoFala.NENHUM;
				this.fala = '';
			}
		}
	}
});

game.HUD.ScoreItem = me.Renderable.extend( {	
	init: function(x, y) {
		this._super(me.Renderable, 'init', [x, y, 10, 10]); 
		this.score = -1;
		this.floating = true;
		this.tempo = me.timer.getTime()+20000;
	},
	update : function () {
		if (this.score !== game.data.score) {	
			this.score = game.data.score;
			this.tempo = me.timer.getTime()+20000;
			return true;
		}
		
		if (this.tempo <= me.timer.getTime()) {
			if (game.data.score > 0) {
				game.data.score -= 1;
			}
		}
		
		if (game.data.score > 19) {
			me.state.change(me.state.GAMEOVER);
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
		if (entidadeJogador === undefined) return true;
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

game.HUD.Money = me.Renderable.extend({	
	init: function(x, y) {
		this._super(me.Renderable, 'init', [x, y, 10, 10]); 
		this.floating = true;
	},
	update : function () {
		return true;
	},
	draw : function (ctx) {
		var context = ctx.getContext();
		this.font = new me.Font("Burnstown", 50, '#000000');
		this.font.bold();
		this.font.draw(context, 'R$: ' + game.data.money.toFixed(2), this.pos.x, this.pos.y);		
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