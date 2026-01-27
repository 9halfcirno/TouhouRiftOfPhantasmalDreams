class Controller {
	constructor(camera) {
		this.camera = camera || new THREE.PerspectiveCamera(
			60,
			GAME_CONFIG.WIDTH / GAME_CONFIG.HEIGHT,
			0.1,
			1000);
	}
	
	update() {
		throw new Error("Controller子类必须实现该方法")
	}
}

export {
	Controller
}