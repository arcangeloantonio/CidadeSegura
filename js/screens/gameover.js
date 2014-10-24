game.GameOver = me.ScreenObject.extend({
    onResetEvent : function() {
		me.audio.stop("afro_american");
		me.audio.stop("latin_flute");
		me.audio.stop("car_accel");
		me.audio.stop("car_stop");
		me.audio.stop("crash");
        me.game.world.addChild(
            new me.Sprite(
                0,0, 
                me.loader.getImage(game.data.gameoverscreen)
            ),
            1
        );
        me.game.world.addChild(new (me.Renderable.extend ({
            init : function() {
                this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);
            },
            update : function (dt) {
                return true;
            },
            draw : function (ctx) {
				var context = ctx.getContext();
				var textoFim = "Fim de jogo!";
				if (game.data.gameoverscreen == 'game_over_money') {
					this.font = new me.Font("Trebuchet MS", 50, '#FF0000');
					this.font.draw(context, textoFim, 400, 370);
					this.font = new me.Font("Trebuchet MS", 30, '#FF0000');
					this.font.draw(context, game.data.gameovermessage, 380, 430);
				}
				else if (game.data.gameoverscreen == 'game_over_points') {
					this.desenharFonteCentro(context, textoFim, 250, 50, "#FFFF00", true);
					this.desenharFonteCentro(context, game.data.gameovermessage, 300, 30, "#FFFF00", true);
				}
				else if (game.data.gameoverscreen == 'game_over_pedestrian') {
					this.desenharFonteCentro(context, "Fim de jogo!", 20, 50, "#FFFF00", true);
					this.desenharFonteCentro(context, 'Você atropelou um pedestre! :(', 90, 30, "#FFFF00", true);
				}
				else {
					this.desenharFonteCentro(context, "Fim de jogo!", 50, 50, "#FF0000");
					this.desenharFonteCentro(context, game.data.gameovermessage, 120, 30, "#FF0000");
				}
            },
			desenharFonteCentro: function(contexto, texto, y, tamanhoFonte, cor, borda) {					
				this.text = texto;
				this.font = new me.Font("Trebuchet MS", tamanhoFonte, cor);
				var measureTitle = this.font.measureText(contexto, this.text);
				var centerWidth = me.game.viewport.width/2 - measureTitle.width/2;
				this.font.draw(contexto, this.text, centerWidth, y);
				if (borda !== undefined && borda) {
					this.font.lineWidth = 3;
					this.font.drawStroke(contexto, this.text, centerWidth, y);
				}
			}
        })), 2);
		
		me.input.bindKey(me.input.KEY.ENTER, "enter", true);
		me.input.bindKey(me.input.KEY.ESC, "esc", true);
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
            if (action === "enter" || action === "esc") {
				game.data.score = 0;
				game.data.balaoFala = 0;
				game.data.money  = 300;
				game.data.gameovermessage = '';
				game.data.alertaFala = false;
				game.data.mensagemAlerta = '';
				game.data.subalerta = '';
				me.state.change(me.state.MENU);
			}
        });
    },
    onDestroyEvent : function() {
        me.input.unbindKey(me.input.KEY.ENTER);
        me.event.unsubscribe(this.handler);
   }
});