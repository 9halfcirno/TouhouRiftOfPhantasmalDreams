import * as THREE from "../libs/three.module.js"
import {
	Position,
	Vector3,
	Vector2
} from "./position.js"
import {
	util
} from "./utils.js"
import {
	Config
} from "./_config.js"
import { system } from "./system_game_tick.js"

import { THREEManager } from "./manager_three.js"


//=== 显示一个

class GameObject {
	/**
	 * 创建一个GameObject对象
	 * @param {Object} obj 这个对象应该包含material, geometry
	 */
	constructor(obj = {
		material: new THREE.MeshBasicMaterial(),
		geometry: new THREE.BoxGeometry(1, 1, 1)
	}) {
		this.three = {
			material: obj.material,
			geometry: obj.geometry,
			mesh: new THREE.Mesh(obj.geometry, obj.material) // 自动创建Mesh
		};
		this.position = obj.position?.clone?.() || new Position();
		this._orginPos = new Position(...this.position); // 用于Threee缓动的坐标
		// x => yaw (水平旋转)
		// y => pitch (垂直旋转)
		this.rotation = new Vector2(0, 0); // 2D对象只需要两个旋转值
		this.uuid = util.uuid(); // 获取uuid
		this.updateThreeData(1);
		this._resizeMeshByTexture();
		this._fixThreePosition();

		this.three.mesh.name = this.uuid;
		this.three.mesh.castShadow = true;
		this.three.mesh.receiveShadow = true;
		this.inMap = null;                                            
		// GameObject.objectsMap.set(this.uuid, this); // 把自己扔对象池
	}
	/**
	 * 设置GmaeObject的游戏坐标，并自动处理THREE坐标
	 * @param {Number} x 
	 * @param {Number} y 
	 * @param {Number} z 
	 * @returns {GameObject} 返回this
	 */
	setPosition(x, y, z) {
		if (x === 0 && y === 0 && z === 0) return this;
		this._orginPos.copy(this.position);
		this.position.set(x, y, z);
		this.updateThreeData();
		this._fixThreePosition();
		return this;
	}
	/**
	 * 
	 * @param {Number} [p=1] 插值，0~1
	 */
	updateThreeData(p = 1) {
		p = p > 1 ? 1 : p;
		let mesh = this.three.mesh;
		// 废用 mesh.rotation.set(...this.rotation, 0)

		// const toPos = this.position.toTHREE().toArray();
		// const orgPos = this._orginPos.toTHREE().toArray();

		// mesh.position.set(...(orgPos.map((pos, i) => pos + (toPos[i] - pos) * p)))
		mesh.position.set(...this.tweenPosition(p).toTHREE())
		mesh.rotation.set(Config["object2d_tilt"], 0, 0); // 2D对象只需要倾斜角度
		// 精灵图不用随着旋转
		this._fixThreePosition();
	}

	tweenThree(p) {
		this.updateThreeData(p)
	}

	tweenPosition(p) {
		const toPos = this.position.toArray();
		const orgPos = this._orginPos.toArray();

		return new Position(...orgPos.map((pos, i) => pos + (toPos[i] - pos) * p))
	}

	_resizeMeshByTexture() { // 应该考虑repeat
		let tex = this.three.material?.map;
		if (!tex || !tex.image) return;
		const img = tex.image;
		const unit = tex.userData.pixelsPerUnit; // 16像素 = 1单位
		const width = img.width * tex.repeat.x / unit;
		const height = img.height * tex.repeat.y / unit;
		// 调整 mesh 的缩放
		this.three.mesh.scale.set(width, height, 1);
	}

	_fixThreePosition() { // 修正网格位置
		if (this.three.material?.map?.image) {
			let tex = this.three.material.map;
			const height = tex.image.height * tex.repeat.y / tex.userData.pixelsPerUnit;
			let tilt = Config["object2d_tilt"];
			this.three.mesh.position.y += Math.cos(tilt) * height / 2;
			this.three.mesh.position.z += Math.sin(tilt) * height / 2;
		}
	}

	updateTexture(tex, opts) {
		
	}

	_disposeThree() {
		this.three.material.map.dispose();
		this.three.material.dispose();
		this.three.geometry.dispose();
		this.three.destory = true;
		this.inMap?.removeObject?.(this);
	}
}

export {
	GameObject
}