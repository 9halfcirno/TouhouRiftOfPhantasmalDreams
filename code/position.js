import * as THREE from "../libs/three.module.js"
import {
	Config
} from "./_config.js"

export let Vector2 = THREE.Vector2;
export let Vector3 = THREE.Vector3;

// 该坐标为游戏内坐标，非THREE场景坐标
export class Position extends Vector3 {
	constructor(x = 0, y = 0, z = 0) {
		super(x, y, z);
	}
	// 获取相对坐标
	getRelativePos(obj) {
		let {
			x: px,
			y: py,
			z: pz
		} = obj;
		return new Position(this.x - px, this.y - py, this.z - pz);
	}

	// /**
	//  * 
	//  * @param {Position} pos 要复制的坐标
	//  * @returns 
	//  */

	// clone() {
	// 	return new Position(...this);
	// }
	// /**
	//  * 
	//  * @param {Position} pos 
	//  * @returns 
	//  */
	// copy(pos) {
	// 	this.x = pos.x;
	// 	this.y = pos.y;
	// 	this.z = pos.z;
	// 	return this;
	// }

	/*		// 转为THREE坐标（考虑倾斜角和z轴方向）
			toTHREE() {
				const a = Config["y_tilt"];
				// 游戏y轴投影到THREE的y和z轴
				// THREE的z轴方向与游戏相反，取反
				return new THREE.Vector3(
					this.x,
					this.y * Math.cos(a),
					this.y * Math.sin(a) - this.z
				);
			}
		
			static fromTHREE(v) {
				const a = Setting.get("y_tilt");
				// 反向投影并转换为游戏坐标系
				return new Position(
					v.x,
					v.y / Math.cos(a),
					v.y * Math.tan(a) - v.z
				);
			}*/
	// 游戏坐标到THREE坐标
	toTHREE() {
		const a = Config["y_tilt"];
		return new THREE.Vector3(
			// 算了编不动了，我也不清楚怎么转换的，试着试着就好了
			this.x, // 游戏X -> THREE.X（水平）
			this.z + this.y * Math.sin(a), // 游戏Y的垂直分量 -> THREE.Y
			this.y + Math.cos(a) * this.y * 0.5 // * Math.sin(a) + this.z // 游戏Y的深度分量 + 游戏Z -> THREE.Z
		);
	}

	static fromTHREE(v) {
		const tiltAngle = Config["y_tilt"] || Math.PI / 4;

		// 这个转换比较困难，因为一个THREE点可能对应多个游戏点
		// 通常假设游戏Z已知或为0，或者需要额外信息

		// 简单版本：假设游戏Z = 0
		const gameY = v.y / Math.cos(tiltAngle);

		return new Position(
			v.x, // X直接对应
			gameY, // 反算Y
			v.z - gameY * Math.tan(tiltAngle) // 从总深度中减去Y的深度分量
		);
	}
}