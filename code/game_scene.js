import * as THREE from "../libs/three.module.js"
import {
	OrbitControls
} from "../libs/three.OrbitControls.js"
import {
	GameMap
} from "./game_map.js"
import {
	Config
} from "./_config.js"
import {
	KeyboardInput as Key
} from "./inputs/keyboard.js"


class GameScene {
	constructor(args = {}) {
		/*=== three.js部分 ===*/
		// 游戏场景都渲染在这里
		this.three = {
			scene: new THREE.Scene(), // three三元素
			camera: new THREE.PerspectiveCamera(
				60,
				args.width / args.height,
				0.1,
				1000),
			renderer: new THREE.WebGLRenderer({
				antialias: true
			}),
			// light: new THREE.DirectionalLight(0xFFFFFF, 1)
		};
		this.three.camera.name = "Camera_default";
		this.three.renderer.setSize(args.width, args.height);
		this.three.renderer.setClearColor(0x000000);
		this.three.renderer.setPixelRatio(window.devicePixelRatio);
		this.three.renderer.shadowMap.enabled = true;

		this.domElement = this.three.renderer.domElement;

		const color = 0xFFFFFF;
		const intensity1 = 2;
		this.three.ambLight = new THREE.AmbientLight(color, 0.1);
		this.three.scene.add(this.three.ambLight)
		this.three.dirLight = new THREE.DirectionalLight(color, intensity1);
		this.three.dirLight.position.copy(this.three.camera.position);
		let {
			x: cx,
			y: cy,
			z: cz
		} = this.three.camera.position;
		let a = Math.PI / 2 - Config["object2d_tilt"];
		this.three.dirLight.target.position.set(cx, cy - Math.sin(a), cz - Math.cos(a));
		this.three.dirLight.castShadow = true;
		this.three.dirLight.shadow.camera.near = 0.1;
		this.three.dirLight.shadow.camera.far = 120;
		this.three.dirLight.shadow.camera.left = -60;
		this.three.dirLight.shadow.camera.right = 60;
		this.three.dirLight.shadow.camera.top = 60;
		this.three.dirLight.shadow.camera.bottom = -60;
		this.three.dirLight.shadow.bias = -0.001;
		this.three.dirLight.shadow.mapSize.width = 2048;
		this.three.dirLight.shadow.mapSize.height = 2048;
		this.three.scene.add(this.three.dirLight);
		this.three.scene.add(this.three.dirLight.target);

		/*=== 场景属性部分 ===*/
		this.gameMaps = new Map();
		this.gameMapNow = null;

		this.useCamera = this.three.camera;
	}

	_updateLightPosition() {
		// 更新光源位置为相机位置
		this.three.dirLight.position.copy(this.three.camera.position);

		// 获取相机当前位置
		const {
			x: cx,
			y: cy,
			z: cz
		} = this.three.camera.position;

		// 计算倾斜角度
		const a = Math.PI / 2 - Config["object2d_tilt"];

		// 更新光源目标位置（基于相机位置和倾斜角度）
		this.three.dirLight.target.position.set(
			cx,
			cy - Math.sin(a),
			cz - Math.cos(a)
		);

		// 如果使用了阴影，可能需要更新阴影相机
		if (this.three.dirLight.castShadow) {
			this.three.dirLight.shadow.camera.position.copy(this.three.dirLight.position);
			this.three.dirLight.shadow.camera.lookAt(this.three.dirLight.target.position);
			this.three.dirLight.shadow.camera.updateProjectionMatrix();
		}
	}

	$debug() {
		this.debug = {}
		// 调试辅助
		this.debug.grid = new THREE.GridHelper(16, 16);
		this.three.scene.add(this.debug.grid);
		this.debug.axes = new THREE.AxesHelper(10);
		this.three.scene.add(this.debug.axes);

		this.debug.camera = new THREE.PerspectiveCamera(
			60,
			this.three.camera.aspect,
			0.1,
			1000);
		this.debug.controls = new OrbitControls(this.debug.camera, this.domElement);

		let camHelper = new THREE.CameraHelper(this.three.camera);
		console.log(this.debug.controls);

		this.three.scene.add(camHelper);

		let lightHelper = new THREE.CameraHelper(this.three.dirLight.shadow.camera);
		this.three.scene.add(lightHelper)

		this.debug.camera.position.set(2, 2, 2)
		this.useCamera = this.debug.camera;
		Key.onKey("Enter", () => {
			let orPos = this.useCamera.position;
			this.useCamera = (this.useCamera === this.debug.camera ? this.three.camera : this.debug.camera)
			// this.debug.controls.target.copy(orPos);
			// orPos.y -= 0.1;
			// this.useCamera.position.copy(orPos)
		})
		window.addEventListener('resize', () => {
			GAME_CONFIG.WIDTH = Math.min(window.innerWidth);
			GAME_CONFIG.HEIGHT = Math.min(window.innerWidth * (9 / 16), window.innerHeight);
			this.refreshThreeArgs({
				width: GAME_CONFIG.WIDTH,
				height: GAME_CONFIG.HEIGHT
			})
		});
	}

	refreshThreeArgs(args = {}) {
		this.three.camera.aspect = args.width / args.height;
		this.three.camera.updateProjectionMatrix();
		this.three.renderer.setSize(args.width, args.height);
	}

	render(opts = {
		progress: 1
	}) {
		if (this.gameMapNow) {
			let map = this.gameMaps.get(this.gameMapNow);
			map.tweenThree(opts.progress);
		};

		this._updateLightPosition();
		this.debug?.controls?.update?.()
		this.three.renderer.render(this.three.scene, this.useCamera)
	}

	update() {
	}

	/*=== GameMap管理 ===*/
	// 添加一个map
	addGameMap(map) {
		if (!(map instanceof GameMap)) throw new Error(`GameScene只允许添加GameMap实例`)
		this.gameMaps.set(map.id, map)
		if (this.gameMapNow) map._exitScene();
		else {
			this.gameMapNow = map.id;
			map._enterScene()
		}
		// 把map的threeGroup添加进来
		this.three.scene.add(map.three.group);
	}
	// 切换到map
	switchToGameMap(id) {
		if (id === this.gameMapNow) return;
		let map = this.gameMaps.get(id);
		this.gameMaps.get(this.gameMapNow)?._exitScene?.();
		this.gameMapNow = id;
		map._enterScene();
	}
	// 移除map
	removeGameMap(id) {
		let map = this.gameMaps.get(id);
		map?._exitScene?.();
		this.three.scene.remove(map.three.group)
	}
}

export {
	GameScene
}