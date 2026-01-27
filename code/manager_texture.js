import * as THREE from "../libs/three.module.js"
import {
	ID
} from "./parser_thid.js"

const TextureManager = {
	cache: new Map(), // 维护[url: THREE.Texture实例]的映射，也充当纹理池
	three: {
		textureLoader: new THREE.TextureLoader()
	},
	/**
	 * 
	 * @param {String} thid 一个type=texture的thid
	 * @returns 解析后的纹理url
	 */
	_parseTextureUrl(thid) {
		if (!thid) return;
		let a = ID.parse(thid);
		if (a.type !== "texture") throw new Error(`[Texture] 错误的thid类型: ${thid}`);
		// 解析url
		let url = `${GAME_CONFIG.RUN_PATH}/assets/textures`;
		url += "/" + a.id;
		url += ".png";
		return url;
	},
	/**
	 * 加载纹理的方法，可用await
	 * @param {String} thid 纹理的thid
	 * @param {{ useCache: boolean; }} [opts] 额外选项
	*/
	load(thid, opts = {
		useCache: true
	}) {
		let url = this._parseTextureUrl(thid);
		if (!url) return;

		let self = this;
		// 用textureLoader加载
		return new Promise((resolve, reject) => {
			if (self.cache.has(url) && opts.useCache) resolve(self.cache.get(url));
			self.three.textureLoader.load(url, (tex) => {
				tex.magFilter = THREE.NearestFilter;
				tex.minFilter = THREE.NearestFilter;
				tex.name = thid;
				tex.userData.pixelsPerUnit = opts.pixelsPerUnit || 16; // 保存尺寸
				self.cache.set(url, tex) // 为后续最快加载，不论是否useCache，都保持缓存，同时作为管理器对纹理的引用
				resolve(tex)
			}, () => { }, reject)
		})
	},
	/**
	 * 
	 * @param {String} thid 纹理的thid
	 * @param {Object} opts 额外选项
	 * @returns {THREE.Texture}
	 */
	get(thid, opts = { async: false }) {
		if (!thid) return;

		if (!opts.async) {
			let url = this._parseTextureUrl(thid);
			let org = this.cache.get(url); // 直接从纹理池获取
			if (!org) throw new Error(`[Texture] 纹理: "${thid}"尚未加载`)
			return org.clone() // 防止修改原纹理
		} else {
			return this.load(thid).then(tex => tex.clone())
		}

	},
	dispose(thid) {
		let url = this._parseTextureUrl(thid);
		this.cache.get(url)?.dispose?.();
	}
}

export {
	TextureManager
}