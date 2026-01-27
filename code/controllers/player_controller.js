import {
	Controller
} from "./controller.js";
import {
	KeyboardInput as Key
} from "../inputs/keyboard.js";
import {
	Config
} from "../_config.js"
import { Entity } from "../game_entity.js";
import { util } from "../utils.js";

class PlayerController extends Controller {
	constructor(entity, camera) {
		if (typeof entity === "string") {
			entity = Entity.getEntity(entity);
		}
		super(camera);
		this.target = entity;
		//if (camera) this.camera.target = this.target
	}

	update() {
		if (!this.target) return;
		if (!this.target.isAlive) return;
		let w = Key.key("w").down;
		let a = Key.key("a").down;
		let s = Key.key("s").down;
		let d = Key.key("d").down;
		let down = Key.key("Shift").down;
		let fly = Key.key(" ").down;
		
		let speed = this.target.getComponentValue("th:speed") || 0.5;
		
		this.target.moveBy((d - a) * speed, (fly - down) * speed, (w - s) * speed)
	}

	onRender(opts = { progress: 1 }) {
		this.update();
		if (!this.target.isAlive) return;
		if (this.camera) {
			const pos = this.target.tweenPosition(opts.progress).toTHREE().toArray();

			let a = Config["object2d_tilt"];
			let dis = Config["camera_distance"];
			const orgPos = this.camera.position.toArray();
			const toPos = [pos[0], pos[2] + Math.cos(a) * dis, -pos[1] + Math.sin(a) * dis];
			this.camera.position.set(...orgPos.map((p, i) => {
				//if (Math.abs(toPos[i] - p) < 0.01) return toPos[i];
				return p + (toPos[i] - p) / (16 / Config["camera_follow_speed"]);
			}))
			// this.camera.position.set(pos[0], pos[2] + Math.cos(a) * dis, -pos[1] + Math.sin(a) * dis)
			this.camera.rotation.set(Config["object2d_tilt"] - Math.PI / 2, 0, 0);
		}
	}
}

export {
	PlayerController
}