game.TitleScreen = me.ScreenObject.extend({
    onResetEvent : function() {
        me.game.world.addChild(
            new me.Sprite(
                0,0, 
                me.loader.getImage('title_screen')
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
				this.desenharFonteCentro(context, "Cidade Segura", 50, 100, "red");
				this.desenharFonteCentro(context, "Jogar", 200, 50, game.data.posicaoMenu == 1 ? "red" : "white");
				this.desenharFonteCentro(context, "Opcoes", 300, 50, game.data.posicaoMenu == 2 ? "red" : "white");
				this.desenharFonteCentro(context, "Ajuda", 400, 50, game.data.posicaoMenu == 3 ? "red" : "white");
				this.desenharFonteCentro(context, "Creditos", 500, 50, game.data.posicaoMenu == 4 ? "red" : "white");
            },			
			desenharFonteCentro: function(contexto, texto, y, tamanhoFonte, cor) {					
				this.text = texto;
				this.font = new me.Font("Burnstown", tamanhoFonte, cor);
				var measureTitle = this.font.measureText(contexto, this.text);
				this.font.draw(contexto, this.text, me.game.viewport.width/2 - measureTitle.width/2, y);	
			}
        })), 2);
		
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
		
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
            if (action === "enter") {
				if (game.data.posicaoMenu === 1) {
					me.state.change(me.state.PLAY);
				}
				else if (game.data.posicaoMenu === 4) {
					me.state.change(me.state.CREDITS);
				}
            }
			else if (action === "up") {
				game.data.posicaoMenu = game.data.posicaoMenu == 1 ? game.data.posicaoMenu : game.data.posicaoMenu - 1;
			}
			else if (action === "down") {
				game.data.posicaoMenu = game.data.posicaoMenu == 4 ? game.data.posicaoMenu : game.data.posicaoMenu + 1;
			}
        });
    },
    onDestroyEvent : function() {
        me.input.unbindKey(me.input.KEY.ENTER);
        me.event.unsubscribe(this.handler);
   }
});