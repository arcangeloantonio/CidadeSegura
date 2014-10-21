var game = {
	tipoFala: { NENHUM: 0, PEGOU: 1, DEIXOU: 2, PEDESTRE: 3},
	data : {
		score : 0,
		posicaoMenu: 1,
		balaoFala: 0,
		money: 300,
		somLigado: true,
		gameovermessage: '',
		alertaFala: false,
		mensagemAlerta: '',
		subalerta: '',
		gameoverscreen: ''
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
		me.state.set(me.state.HELP, new game.HelpScreen());
		me.state.set(me.state.SETTINGS, new game.ConfigScreen());
		me.state.set(me.state.CREDITS, new game.CreditScreen());
		me.state.set(me.state.GAMEOVER, new game.GameOver());
		
		me.pool.register("mainPlayer", game.PlayerEntity, 99);
		me.pool.register("TrafficLightEntity", game.TrafficLightEntity);
		me.pool.register("BusRoadEntity", game.BusRoadEntity);
		me.pool.register("PassagerEntity", game.PassagerEntity);
		me.pool.register("PedestrianEntity", game.PedestrianEntity);
		me.pool.register("EnemyEntity", game.EnemyEntity);
		me.pool.register("PedestrianLightEntity", game.PedestrianLightEntity);
		me.pool.register("StopEntity", game.StopEntity);
		me.pool.register("VelocityEntity", game.VelocityEntity);

		me.input.bindKey(me.input.KEY.UP, "up");
		me.input.bindKey(me.input.KEY.LEFT,	"left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.DOWN, "down");

        me.state.change(me.state.MENU);
    }
};