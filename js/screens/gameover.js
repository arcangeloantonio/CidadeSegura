game.GameOver = me.ScreenObject.extend({
    onResetEvent : function() {
		me.audio.stop("afro_american");
		me.audio.stop("latin_flute");
		me.audio.stop("car_accel");
		me.audio.stop("car_stop");
        me.game.world.addChild(
            new me.Sprite(
                0,0, 
                me.loader.getImage('game_over')
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
				this.desenharFonteCentro(context, "Você perdeu! :(", 50, 50, "#FF0000");
            },			
			desenharFonteCentro: function(contexto, texto, y, tamanhoFonte, cor) {					
				this.text = texto;
				this.font = new me.Font("Burnstown", tamanhoFonte, cor);
				var measureTitle = this.font.measureText(contexto, this.text);
				this.font.draw(contexto, this.text, me.game.viewport.width/2 - measureTitle.width/2, y);	
			}
        })), 2);
		
		me.input.bindKey(me.input.KEY.ENTER, "enter", true);
		me.input.bindKey(me.input.KEY.ESC, "esc", true);
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
            if (action === "enter" || action === "esc") {
				me.state.change(me.state.MENU);
			}
        });
    },
    onDestroyEvent : function() {
        me.input.unbindKey(me.input.KEY.ENTER);
        me.event.unsubscribe(this.handler);
   }
});