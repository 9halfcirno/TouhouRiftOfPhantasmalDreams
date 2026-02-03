import * as TH from "./module_all.js"
import {
	default as Stats
} from "../libs/three.stats.js";

let statsTps = new Stats();
statsTps.setMode(0);
statsTps.domElement.style.left = window.innerWidth - 80 + 'px';
//statsTps.domElement.style.bottom = '0px';
document.body.append(statsTps.domElement);
let statsFps = new Stats();
statsFps.setMode(0);
//statsFps.domElement.style.bottom = '0px';
document.body.append(statsFps.domElement);
const debugdiv = document.getElementById("debug")


globalThis.GAME_CONFIG = { // 总配置
	RUN_PATH: document.location.href.slice(0, document.location.href.lastIndexOf("/")),
	STAGE_ASPECT: 16 / 9,
	STAGE_WIDTH: Math.min(window.innerWidth),
	STAGE_HEIGHT: Math.min(window.innerWidth * (9 / 16), window.innerHeight)
}
const maxWidth = window.innerWidth;
const maxHeight = window.innerHeight;
const windowAspect = maxWidth / maxHeight;

if (windowAspect > GAME_CONFIG.STAGE_ASPECT) {
	GAME_CONFIG.STAGE_HEIGHT = maxHeight;
	GAME_CONFIG.STAGE_WIDTH = maxHeight * GAME_CONFIG.STAGE_ASPECT;
} else {
	GAME_CONFIG.STAGE_WIDTH = maxWidth;
	GAME_CONFIG.STAGE_HEIGHT = maxWidth / GAME_CONFIG.STAGE_ASPECT;
}


console.log("游戏配置:", GAME_CONFIG)

globalThis.scene = new TH.GameScene({
	width: GAME_CONFIG.STAGE_WIDTH,
	height: GAME_CONFIG.STAGE_HEIGHT,
})

globalThis.debug = {};

scene.render()
//scene.$debug()
document.getElementById("game").append(scene.domElement)

document.addEventListener('contextmenu', function (event) {
	event.preventDefault();
});


TH.system.update = () => {
	scene.update()
	ctrl.update();
	statsTps.update();
	TH.System.updateAll();
	debugdiv.innerHTML = `player x: ${entity.position.x}, y: ${entity.position.y}, z: ${entity.position.z}
</br>player hp: ${entity.getComponentValue("th:hp")}
</br>entity count: ${TH.Entity.getAllEntities().length}
</br>frame: ${THSystem.frame}`;
}

function render() {
	ctrl.onRender({
		progress: TH.system.tickP
	});
	scene.render({
		progress: TH.system.tickP
	})
	statsFps.update();
	requestAnimationFrame(render)
}

debug.main = new TH.GameSplicingMap("th:map=main");
await debug.main._createMap()
scene.addGameMap(debug.main)
scene.switchToGameMap("th:map=main")

await TH.TextureManager.load("th:texture=entity/reimu")
//await TH.TextureManager.load("th:texture=a")
//await TH.Entity.registerEntity("th:entity=bullet/ball");
await TH.Entity.registerEntity("th:entity=character/reimu");
await TH.TextureManager.load("th:texture=entity/fairy")
await TH.Entity.registerEntity("th:entity=enemy/fairy");
let entity = new TH.Entity("th:entity=character/reimu")
debug.entity = entity;

let e2 = new TH.Entity("th:entity=enemy/fairy")
debug.main.addObject(entity)
debug.main.addObject(e2)

let ctrl = new TH.PlayerController(entity.uuid, scene.three.camera)

render()

TH.system.startTick()

TH.KeyboardInput.onKey("x", () => {
	 for (let i = 0; i < 100; i++) {
	let e = new TH.Entity("th:entity=enemy/fairy", {
		position: entity.position
	});
	debug.main.addObject(e);
	e._disposeThree();
	 }
});

TH.KeyboardInput.onKey("z", () => {
	entity.getComponent("th:hp").value -= 1;
})

TH.MouseInput.onWheel((wheel) => {
	TH.Config["camera_distance"] += wheel.y * 0.01;
})
