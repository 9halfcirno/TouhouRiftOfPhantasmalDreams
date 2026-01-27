import {
	util
} from "./utils.js";

class Ticker {
	constructor(name) {
		if (name && Ticker.tickers.has(name)) {
			console.warn(`[Ticker] Ticker with name "${name}" already exists`);
		}

		this.ticks = [];
		this.isActive = true;
		this.name = name || util.uuid();

		Ticker.tickers.set(this.name, this);
	}

	add(f, options = {}) {
		if (!f) return;
		if (typeof f !== "function") {
			throw new Error(`[Ticker] Expected a function, got ${typeof f}`);
		}

		// 避免重复添加同一函数
		if (options.preventDuplicate && this.ticks.includes(f)) {
			return this;
		}

		this.ticks.push(f);
		return this;
	}

	remove(f) {
		const index = this.ticks.indexOf(f);
		if (index !== -1) {
			this.ticks.splice(index, 1);
		}
		return this;
	}

	clear() {
		this.ticks = [];
		return this;
	}

	destroy() {
		this.clear();
		this.isActive = false;
		Ticker.tickers.delete(this.name);
		return this;
	}

	tick() {
		if (!this.isActive || this.ticks.length === 0) return;

		// 使用 for 循环而不是 for-of 以获得更好性能
		for (let i = 0; i < this.ticks.length; i++) {
			const f = this.ticks[i];
			if (f) {
				try {
					f();
				} catch (error) {
					console.error(`[Ticker] Error in tick function:`, error);
				}
			}
		}
	}

	get size() {
		return this.ticks.length;
	}

	// 静态方法
	static tickAll() {
		// 检查是否还有活跃的 ticker
		let hasActiveTickers = false;

		for (const ticker of Ticker.tickers.values()) {
			if (ticker.isActive && ticker.size > 0) {
				ticker.tick();
				hasActiveTickers = true;
			}
		}

		// 只有存在活跃 ticker 时才继续循环
		if (hasActiveTickers) {
			Ticker.animationFrameId = requestAnimationFrame(Ticker.tickAll);
		} else {
			Ticker.animationFrameId = null;
		}
	}

	static start() {
		if (Ticker.animationFrameId) return;

		Ticker.animationFrameId = requestAnimationFrame(() => {
			Ticker.tickAll();
		});
	}

	static stop() {
		if (Ticker.animationFrameId) {
			cancelAnimationFrame(Ticker.animationFrameId);
			Ticker.animationFrameId = null;
		}
	}

	static get(name) {
		return Ticker.tickers.get(name);
	}

	static has(name) {
		return Ticker.tickers.has(name);
	}

	static destroy(name) {
		const ticker = Ticker.tickers.get(name);
		if (ticker) {
			ticker.destroy();
		}
	}

	static destroyAll() {
		for (const ticker of Ticker.tickers.values()) {
			ticker.destroy();
		}
		Ticker.stop();
	}

	static get activeCount() {
		let count = 0;
		for (const ticker of Ticker.tickers.values()) {
			if (ticker.isActive && ticker.size > 0) count++;
		}
		return count;
	}
}

// 静态属性
Ticker.tickers = new Map();
Ticker.animationFrameId = null;
Ticker.isTicking = false;

export {
	Ticker
};