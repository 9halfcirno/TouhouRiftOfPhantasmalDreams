import * as THREE from "../libs/three.module.js"

class THREEManager {
	constructor() {
		this.threeObjects = new Map();
		this.three = {
			group: new THREE.Group()
		}
		this.three.group.castShadow = true;
		this.three.group.receiveShadow = true;
	}
	
	add(obj) {
		this.threeObjects.set(obj.uuid, obj);
		this.three.group.add(obj)
	}
	
	remove(obj) {
		this.threeObjects.delete(obj.uuid);
		this.three.group.remove(obj)
	}
	
	clear() {
		this.threeObjects.clear()
		this.three.group.clear()
	}
}

export {THREEManager}