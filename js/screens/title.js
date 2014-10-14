game.TitleScreen = me.ScreenObject.extend({
    onResetEvent : function() {
		me.audio.playTrack("afro_american");
		me.audio.stop("latin_flute");
		me.audio.stop("car_accel");
		me.audio.stop("car_stop");
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
				this.desenharFonteCentro(context, "Cidade Segura", 30, 100, "#000000");
				this.desenharFonteCentro(context, "Jogar", 220, 50, game.data.posicaoMenu == 1 ? "#FF0000" : "#000000");
				this.desenharFonteCentro(context, "Configurações", 320, 50, game.data.posicaoMenu == 2 ? "#FF0000" : "#000000");
				this.desenharFonteCentro(context, "Ajuda", 420, 50, game.data.posicaoMenu == 3 ? "#FF0000" : "#000000");
				this.desenharFonteCentro(context, "Créditos", 520, 50, game.data.posicaoMenu == 4 ? "#FF0000" : "#000000");
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
            if (action === "enter") {
				me.audio.play("select_menu", false, null, 0.1);
				switch (game.data.posicaoMenu) {
					case 1:
						me.state.change(me.state.PLAY);
						break;
					case 2:
						me.state.change(me.state.SETTINGS);
						break;
					case 3:
						me.state.change(me.state.HELP);
						break;
					case 4:
						me.state.change(me.state.CREDITS);
						break;
				}
            }
			else if (action === "up") {
				game.data.posicaoMenu = game.data.posicaoMenu == 1 ? game.data.posicaoMenu : game.data.posicaoMenu - 1;
				me.audio.play("change_menu", false, null, 0.1);
			}
			else if (action === "down") {
				game.data.posicaoMenu = game.data.posicaoMenu == 4 ? game.data.posicaoMenu : game.data.posicaoMenu + 1;
				me.audio.play("change_menu", false, null, 0.1);
			}
        });
    },
    onDestroyEvent : function() {
        me.input.unbindKey(me.input.KEY.ENTER);
        me.event.unsubscribe(this.handler);
   }
});