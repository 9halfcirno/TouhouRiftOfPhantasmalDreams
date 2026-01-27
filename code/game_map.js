import * as THREE from "../libs/three.module.js"
import {ID} from "./parser_thid.js"
import {GameObject} from "./game_object.js"
import {THREEManager} from "./manager_three.js"
import {Config} from "./_config.js"

class GameMap {
	constructor(id) { // 传入thid
		this.three = {
			group: new THREE.Group(),
		};
		this.three.group.name = `GameMap_${id}`
		this.three.group.rotation.x = Config["tile_tilt"]
		this.id = id;
		this.isInScene = true;
		
		// 自己内部的three实例管理
		this._threeManager = new THREEManager();
		this.three.group.add(this._threeManager.three.group)

		this.objects = new Map();
	}
	
	addObject(obj) {
		// 拒绝非GameObject实例
		if (!(obj instanceof GameObject)) throw new Error(`传入的参数必须是GameObject实例`);
		this._threeManager.add(obj.three.mesh)

		obj.inMap = this; // 在对象中保存Map引用

		this.objects.set(obj.uuid, obj)
		
	}
	
	removeObject(obj) {
		// 拒绝非GameObject实例
		if (!(obj instanceof GameObject)) throw new Error(`传入的参数必须是GameObject实例`);
		this._threeManager.remove(obj.three.mesh)
		this.objects.delete(obj.uuid)
		obj.inMap = null; // 移除引用
	}
	
	clearObjects() {
		this._threeManager.clear()
		this.objects.clear()
	}
	
	_exitScene() { // 离开场景
		this.three.group.visible = false;
		this.isInScene = false;
	}
	
	_enterScene() {
		this.three.group.visible = true;
		this.isInScene = true;
	}
	
	/**
	 * 渲染时进行THREE插值
	 * @param {Number} [p=1] 插值，从0到1
	 *
	 */
	tweenThree(p = 1) { // THREE插值
		this.objects.forEach(obj => {
			obj.tweenThree(p);
		})
	}
	
	// 仅加载地图数据
	async _loadData() {
		let id = ID.parse(this.id) // 这里使用短id
		let url = `${GAME_CONFIG.RUN_PATH}/definitions/game_maps/${id.id}.js`
		let map = await import(url);
		return map.default;
	}
}


export {GameMap}