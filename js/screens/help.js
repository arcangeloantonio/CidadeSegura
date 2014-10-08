game.HelpScreen = me.ScreenObject.extend({
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
				this.desenharFonteCentro(context, "Ajuda", 200, 50, '#000000');
				
				var texto = "O objetivo do jogo é levar os passageiros ao destino(seguindo a seta amarela em volta do carro) sem cometer infrações. Você pode controlar o seu carro usando as setas";
				this.wrapText(context, texto, 120, 260, 580, 30)
            },		
			wrapText: function(context, text, x, y, maxWidth, lineHeight) {
				var words = text.split(' ');
				var line = '';
		
				for(var n = 0; n < words.length; n++) {
				var testLine = line + words[n] + ' ';
				var metrics = context.measureText(testLine);
				var testWidth = metrics.width;
				if (testWidth > maxWidth && n > 0) {
					context.font="30px Burnstown";
					context.fillText(line, x, y);
					line = words[n] + ' ';
					y += lineHeight;
				}
				else {
					line = testLine;
				}
				}
				context.font="30px Burnstown";
				context.fillText(line, x, y);
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
        });
		
    },
    onDestroyEvent : function() {
        me.event.unsubscribe(this.handler);
   }
});
