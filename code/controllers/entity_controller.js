import {GameObject} from "../game_object.js";
import {Controller} from "./controller.js"

class EntityController extends Controller {
	/**
	 *
	 * @param {GameObject} object 被控制的实体
	 */
	constructor(object) {
		if (!(object instanceof GameObject)) throw new Error("EntityController仅接收GameObject实例");
		super();
		this.target = object;
	}

	update() {
		// 子类必须实现自己的逻辑
		throw new Error("EntityController子类必须实现自己的逻辑")
	}
}

export {
	EntityController
}