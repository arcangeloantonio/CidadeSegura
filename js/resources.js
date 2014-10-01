game.resources = [
	/**
	 * Graphics.
	 */
	// the main player spritesheet
	{name: "car_run",     type:"image",	src: "data/img/sprite/car_run.png"},
	
	{name: "gripe_run_right",     type:"image",	src: "data/img/sprite/gripe_run_right.png"},
	// the spinning coin spritesheet
	{name: "spinning_coin_gold",  type:"image",	src: "data/img/sprite/spinning_coin_gold.png"},
	// our enemty entity
	{name: "wheelie_right",       type:"image",	src: "data/img/sprite/wheelie_right.png"},
	// game font
	{name: "32x32_font",          type:"image",	src: "data/img/font/32x32_font.png"},
	// title screen
	{name: "title_screen",        type:"image",	src: "data/img/gui/title_screen.png"},
	// the parallax background
	{name: "area01_bkg0",         type:"image",	src: "data/img/area01_bkg0.png"},
	{name: "area01_bkg1",         type:"image",	src: "data/img/area01_bkg1.png"},
	// our level tileset
	{name: "area01_level_tiles",  type:"image",	src: "data/img/map/area01_level_tiles.png"},
	// our metatiles
	{name: "metatiles32x32",  	  type:"image", src: "data/img/map/metatiles32x32.png"},
	
	
	//Sprites
	{name: "car_run", type:"image", src: "data/img/sprite/car_run.png"},
	{name: "spinning_coin_gold",  type:"image", src: "data/img/sprite/spinning_coin_gold.png"},
	{name: "transparente",  type:"image", src: "data/img/sprite/transparente.png"},
	{name: "lights",  type:"image", src: "data/img/sprite/lights.png"},
	{name: "pedestrian_lights",  type:"image", src: "data/img/sprite/pedestrian_lights.png"},
	{name: "arrow",  type:"image", src: "data/img/sprite/arrow.png"},
	{name: "passager",  type:"image", src: "data/img/sprite/passager.png"},
	
	//Tiles
	{name: "tiles", type:"image", src: "data/img/map/tiles.png"},
	{name: "terrain_atlas", type:"image", src: "data/img/map/terrain_atlas.png"},
	{name: "placas", type:"image", src: "data/img/map/placas.png"},
	{name: "base_out_atlas", type:"image", src: "data/img/map/base_out_atlas.png"},
	{name: "quarter", type:"image", src: "data/img/map/quarter.png"},
	{name: "sidewalk", type:"image", src: "data/img/map/sidewalk.png"},	
	
	/* 
	 * Maps. 
 	 */
	{name: "area01",              type: "tmx",	src: "data/map/area01.tmx"},
	{name: "area02",              type: "tmx",	src: "data/map/area02.tmx"},
	{name: "map", type: "tmx", src: "data/map/map.tmx"},
	/* 
	 * Background music. 
	 */	
	{name: "dst-inertexponent", type: "audio", src: "data/bgm/"},
	
	/* 
	 * Sound effects. 
	 */
	{name: "cling", type: "audio", src: "data/sfx/"},
	{name: "stomp", type: "audio", src: "data/sfx/"},
	{name: "jump",  type: "audio", src: "data/sfx/"}
];
