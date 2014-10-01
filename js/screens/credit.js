game.CreditScreen = me.ScreenObject.extend({
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
				context.rect(100, 200, 600 , 175);
				context.fillStyle = 'black';
				context.fill();
				context.lineWidth = 7;
				context.strokeStyle = 'red';
				context.stroke();
				
				this.desenharFonteCentro(context, "Programador: Antonio Ruggiero Arcangelo", 250, 30, "red");
				this.desenharFonteCentro(context, "Designer: Diego Fernandes Resende", 300, 30, "red");
            },			
			desenharFonteCentro: function(contexto, texto, y, tamanhoFonte, cor) {					
				this.text = texto;
				this.font = new me.Font("Burnstown", tamanhoFonte, cor);
				var measureTitle = this.font.measureText(contexto, this.text);
				this.font.draw(contexto, this.text, me.game.viewport.width/2 - measureTitle.width/2, y);	
			},
        })), 1);
		
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
		me.input.bindKey(me.input.KEY.ESC, "esc", true);
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
