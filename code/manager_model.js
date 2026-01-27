import * as THREE from "../libs/three.module.js"
import { ID } from "./parser_thid.js"

const ModelManager = {
    cache: new Map(), // 维护[url: THREE.Geometry实例]的映射
    three: {
        modelLoader: new THREE.TextureLoader()
    },
    _parseModelUrl(thid) {
        let a = ID.parse(thid);
        if (a.type !== "texture") throw new Error(`[Texture] 错误的thid类型: ${thid}`);
        // 解析url
        let url = `${GAME_CONFIG.RUN_PATH}/assets/textures`;
        url += "/" + a.id;
        url += ".png";
        return url;
    },
    // 加载纹理的方法，可用await
    load(thid, opts = {
        useCache: true
    }) {
        let url = this._parseModelUrl(thid);
        let self = this;
        // 用textureLoader加载
        return new Promise((resolve, reject) => {
            if (self.cache.has(url) && opts.useCache) resolve(self.cache.get(url));
            self.three.modelLoader.load(url, (tex) => {
                tex.magFilter = THREE.NearestFilter;
                tex.minFilter = THREE.NearestFilter;
                tex.name = thid;
                tex.userData.pixelsPerUnit = opts.pixelsPerUnit || 16; // 保存尺寸
                self.cache.set(url, tex) // 为后续最快加载，不论是否useCache，都保持缓存，同时作为管理器对纹理的引用
                resolve(tex)
            }, () => { }, reject)
        })
    },
    async get(thid) {
        let org = await this.load(thid); // 原纹理
        return org.clone() // 防止修改原纹理
    },
    dispose(thid) {
        let url = this._parseModelUrl(thid);
        this.cache.get(url)?.dispose?.();
    }
}

export {
    ModelManager as TextureManager
}