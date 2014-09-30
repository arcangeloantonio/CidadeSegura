var game = {
	data : {
		score : 0
	},
    "onload" : function () {
        if (!me.video.init("screen", me.video.CANVAS, 800, 600, true, 'auto')) {
            alert("Seu navegador não tem suporte ao HTML5.");
            return;
        }	
		if (document.location.hash === "#debug") {
			window.onReady(function () {
				me.plugin.register.defer(this, debugPanel, "debug");
			});
		}

        me.audio.init("mp3,ogg");
        me.loader.onload = this.loaded.bind(this);
        me.loader.preload(game.resources);
        me.state.change(me.state.LOADING);
		me.sys.gravity = 0;
    },
    "loaded" : function () {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());

		me.pool.register("mainPlayer", game.PlayerEntity, 99);
		me.pool.register("TrafficLightEntity", game.TrafficLightEntity);
		me.pool.register("BusRoadEntity", game.BusRoadEntity);
		me.pool.register("PassagerEntity", game.PassagerEntity);
		me.pool.register("ArrowEntity", game.ArrowEntity, 99);
		me.pool.register("PedestrianEntity", game.PedestrianEntity);
		me.pool.register("EnemyEntity", game.EnemyEntity);
		me.pool.register("PedestrianLightEntity", game.PedestrianLightEntity);

		me.input.bindKey(me.input.KEY.UP, "up");
		me.input.bindKey(me.input.KEY.LEFT,	"left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.DOWN, "down");

        me.state.change(me.state.MENU);
    }
};