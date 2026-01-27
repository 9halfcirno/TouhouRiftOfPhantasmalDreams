const KeyboardInput = {
	_key: new Map(),
	_keyHandler: new Map(),
	ALL: "all_key",

	/**
	 * @param {String} k 键盘按键的key值
	 * @returns {{down:boolean, repeat:boolean}}
	 */
	key(k) {
		// ALL：聚合态（不存状态）
		if (k === this.ALL) {
			let down = false;
			let repeat = false;
			for (const v of this._key.values()) {
				if (v.down) down = true;
				if (v.repeat) repeat = true;
				if (down && repeat) break;
			}
			return { down, repeat };
		}

		// 单键：惰性初始化
		if (!this._key.has(k)) {
			this._key.set(k, {
				down: false,
				repeat: false,
			});
		}
		return this._key.get(k);
	},

	onKey(k, cb) {
		if (typeof cb !== "function") return;
		if (!this._keyHandler.has(k)) {
			this._keyHandler.set(k, []);
		}
		this._keyHandler.get(k).push(cb);
	},

	offKey(k, cb) {
		if (typeof cb !== "function") return;
		const a = this._keyHandler.get(k);
		if (!a) return;
		const i = a.indexOf(cb);
		if (i !== -1) a.splice(i, 1); // 修复 -1 bug
	},

	_triggerKey(k) {
		const a = this._keyHandler.get(k);
		if (!a) return;
		const state = this.key(k);
		for (const c of a) c(state);
	},

	// 🔧 内部：清空所有按键状态（焦点丢失用）
	_resetAllKeys() {
		for (const v of this._key.values()) {
			v.down = false;
			v.repeat = false;
		}
		// 可选：通知 ALL
		this._triggerKey(this.ALL);
	}
};

/* -------------------- 事件绑定 -------------------- */

window.addEventListener("keydown", event => {
	const { key, repeat } = event;
	const keyObj = KeyboardInput.key(key);

	// 防止 keydown 重复覆盖第一次按下语义
	keyObj.down = true;
	keyObj.repeat = repeat;

	KeyboardInput._triggerKey(key);
	KeyboardInput._triggerKey(KeyboardInput.ALL);
});

window.addEventListener("keyup", event => {
	const { key } = event;
	const keyObj = KeyboardInput.key(key);

	keyObj.down = false;
	keyObj.repeat = false;

	// KeyboardInput._triggerKey(key);
	// KeyboardInput._triggerKey(KeyboardInput.ALL);
});

// ✅ 关键修复：窗口失焦 / 页面切换
window.addEventListener("blur", () => {
	KeyboardInput._resetAllKeys();
});

// 某些浏览器在 visibilitychange 更可靠
document.addEventListener("visibilitychange", () => {
	if (document.hidden) {
		KeyboardInput._resetAllKeys();
	}
});

export {
	KeyboardInput
};
