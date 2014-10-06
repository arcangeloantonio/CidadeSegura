game.PlayScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {			
		// play the audio track
		me.audio.playTrack("DST-InertExponent");
		
        // load a level
		me.levelDirector.loadLevel("map");
		
		// reset the score
		game.data.score = 0;
		
		var pauseIsVisible = false;
		
		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
		
		me.game.world.addChild(new (me.Renderable.extend ({
            init : function() {
                this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);
            },
            update : function (dt) {
                return true;
            },
            draw : function (ctx) {
				if (me.state.isPaused()) {
					var context = ctx.getContext();
					context.clearRect(100,200,600,175);
					context.beginPath();
					
					context.rect(100, 200, 600 , 175);
					// context.fillStyle = 'rgba(0,0,0,0.5)';;
					// context.globalAlpha=0.2;
					context.fill();
					context.lineWidth = 7;
					context.strokeStyle = 'red';
					context.stroke();
					this.desenharFonteCentro(context, "Programador: Antonio Ruggiero Arcangelo", 250, 30, "red");
					this.desenharFonteCentro(context, "Designer: Diego Fernandes Resende", 300, 30, "red");
				}
            },			
			desenharFonteCentro: function(contexto, texto, y, tamanhoFonte, cor) {					
				this.text = texto;
				this.font = new me.Font("Burnstown", tamanhoFonte, cor);
				var measureTitle = this.font.measureText(contexto, this.text);
				this.font.draw(contexto, this.text, me.game.viewport.width/2 - measureTitle.width/2, y);	
			},
        })), 999);	
		
		
		me.input.bindKey(me.input.KEY.P, "p", true);
		me.input.bindKey(me.input.KEY.ESC, "esc", true);
		this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
			if (action === "p" || action === "esc") {
				if (me.state.isPaused()) {
					me.state.resume();
				}
				else {
					me.state.pause();
				}
			}
        });
	},
	onUpdateFrame: function()
	{
		console.log('a');
	var context = me.video.getSystemContext();
	},
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		me.event.unsubscribe(this.handler);
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	}
});
