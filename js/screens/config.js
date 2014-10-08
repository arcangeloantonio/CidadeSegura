game.ConfigScreen = me.ScreenObject.extend({
    onResetEvent : function() {
        me.game.world.addChild(new (me.Renderable.extend ({
            init : function() {
                this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);
            },
            update : function (dt) {
                return true;
            },
            draw : function (ctx) {
				var context = ctx.getContext();
				context.beginPath();
				
				context.rect(100, 200, 600 , 50);
				context.fillStyle = '#99C6E0';
				context.fill();
				context.lineWidth = 7;
				context.strokeStyle = '#A2C969';
				context.stroke();
				
				
				context.rect(100, 250, 600 , 175);
				context.fillStyle = '#99C6E0';
				context.fill();
				context.lineWidth = 7;
				context.strokeStyle = '#A2C969';
				context.stroke();
				
				var textoSom = game.data.somLigado ? "LIGADO" : "DESLIGADO";
				this.desenharFonteCentro(context, "Configurações", 200, 50, '#000000');
				this.desenharFonteCentro(context, "Som:    < " + textoSom +  " >", 300, 30, '#FF0000');
            },			
			desenharFonteCentro: function(contexto, texto, y, tamanhoFonte, cor) {					
				this.text = texto;
				this.font = new me.Font("Burnstown", tamanhoFonte, cor);
				var measureTitle = this.font.measureText(contexto, this.text);
				this.font.draw(contexto, this.text, me.game.viewport.width/2 - measureTitle.width/2, y);	
			},
        })), 1);
		
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
            if (action === "enter" || action === "esc") {
				me.state.change(me.state.MENU);
            }
			else if (action === "left" || action === "right") {
				if (game.data.somLigado) {
					me.audio.disable();
				}
				else {
					me.audio.enable();
				}
				game.data.somLigado = !game.data.somLigado;
			}
        });
		
    },
    onDestroyEvent : function() {
        me.event.unsubscribe(this.handler);
   }
});
