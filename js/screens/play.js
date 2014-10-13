game.PlayScreen = me.ScreenObject.extend({
	onResetEvent: function() {			
		me.audio.playTrack("DST-InertExponent");
		me.levelDirector.loadLevel("map");
		game.data.score = 0;
		
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
		
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
		
		me.state.onPause = function () {
			var context = me.CanvasRenderer.getContext();
			var text = "Pausado!";
			this.font = new me.Font("Burnstown", 50, '#FFFF00');
			this.font.bold();
			var measureTitle = this.font.measureText(context, text);
			this.font.draw(context, text, me.game.viewport.width/2 - measureTitle.width/2, 300);
		}
	},
	onDestroyEvent: function() {
		me.event.unsubscribe(this.handler);
		me.game.world.removeChild(this.HUD);
	}
});
