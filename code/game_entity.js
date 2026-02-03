import {
	GameObject
} from "./game_object.js"
import {
	TextureManager
} from "./manager_texture.js";
import {
	ID
} from "./parser_thid.js"
import {
	Config
} from "./_config.js";
import { Vector3 } from "./position.js";
import * as THREE from "../libs/three.module.js"
import { Component } from "./entity_components/component.js";

class Entity extends GameObject {
	constructor(thid = "th:entity=null", params) {

		let def = Entity.entityDefinitions.get(thid);
		if (!def) throw new Error(`[Entity] 未注册的实体: ${thid}`);
		let tex = TextureManager.get(def.texture);
		let geo = new THREE.PlaneGeometry(1, 1);
		let mat = new THREE.MeshLambertMaterial({
			side: THREE.DoubleSide,
			transparent: true, // 使纹理透明
			alphaTest: true // 防止透明像素遮挡后方
		});
		mat.map = tex;

		super({
			geometry: geo,
			material: mat,
			rotation: Config["object2d_tilt"],
			...params
		})
		this.thid = thid;

		this.isAlive = true;
		this.summonTime = THSystem.frame;

		Entity._entityPool.set(this.uuid, this);

		this.components = new Map(); // atts => 属性

		this.loadAllComponents();

		/**
		 * 移动向量
		 * @type {Vector3}
		 */
		this.movementVector = new Vector3(0, 0, 0); // 移动向量，用于移动系统计算
	}
	/**
	 * 修改移动向量, 移动到指定坐标
	 * @param {Number} x 
	 * @param {Number} y 
	 * @param {Number} z 
	 * @returns 
	 */
	moveTo(x, y, z) {
		this.movementVector.set(x - this.position.x, y - this.position.y, z - this.position.z);
		return this;
	}
	/**
	 * 增加移动向量, 相对于当前位置移动
	 * @param {Number} x 
	 * @param {Number} y 
	 * @param {Number} z 
	 * @returns 
	 */
	moveBy(x, y, z) {
		this.movementVector.add(new Vector3(x, y, z));
		return this;
	}

	/**
	 * 
	 * @param {Vector2} dir 移动方向
	 * @returns 
	 */
	step(dir) {
		let speed = this.components.get("th:speed");
		if (!speed) return;
		this.moveBy(Math.cos(dir.x) * speed.value, speed.value * Math.sin(dir.y), Math.sin(dir.x) * speed.value);
		return this;
	}

	die(opts) {
		// this.setComponentValue("th:hp", 0);
		this.isAlive = false;
		Entity.removeEntity(this.uuid);
		this._disposeThree();
	}

	getComponent(type) {
		return this.components.get(type);
	}

	setComponent(type, com) {
		let component = Component.createComponent(type, com);
		this.components.set(type, component);
	}

	hasComponent(type) {
		return this.components.has(type);
	}

	getComponentValue(type) {
		let component = this.components.get(type);
		if (!component) return null;
		return component.value;
	}

	setComponentValue(type, value) {
		let component = this.components.get(type);
		if (component) {
			component.value = value;
		} else {
			const com = new Component.createComponent(type);
			com.value = value;
			this.components.set(type, com);
		}
	}

	loadAllComponents() {
		let def = Entity.entityDefinitions.get(this.thid);
		if (!def) throw new Error(`[Entity] 未注册的实体: ${this.thid}`);
		if (!def.components) return;
		for (let [type, data] of Object.entries(def.components)) {
			this.setComponent(type, data);
		}

	}

	static async registerEntity(thid) {
		let url = Entity._parseEntityUrl(thid);
		let entity = (await import(url)).default;
		Entity.entityDefinitions.set(entity.thid, entity);
		return entity;
	}

	static _parseEntityUrl(thid) {
		let a = ID.parse(thid);
		if (a.type !== "entity") throw new Error(`[Entity] 错误的thid类型: ${thid}`);
		// 解析url
		let url = `${GAME_CONFIG.RUN_PATH}/definitions/entities`;
		url += "/" + a.id;
		url += ".js";
		return url;
	}

	static getEntity(uuid) {
		return this._entityPool.get(uuid);
	}

	static removeEntity(uuid) {
		return this._entityPool.delete(uuid);
	}

	static getAllEntities() {
		return Array.from(this._entityPool.values());
	}
}

Entity.entityDefinitions = new Map()

Entity._entityPool = new Map();

Entity.entityDefinitions.set("th:entity=null", {});


export { Entity }