import { Config } from "./_config.js";

const system = {
	frame: 0,
	_lastTickTime: 0,
	_maxTickTickNum: 5, // 最多追加5轮tick
	_nowTickTickNum: 0, // 目前已经追加的tick数

	tickP: 0,

	needTick() {
		return Date.now() - this._lastTickTime > Config["game_tick_interval"];
	},

	tick() {
		const now = Date.now();
		let tickCount = 0;

		// 如果间隔已经大于tick间隔时间，则执行tick
		// 如果仍然大于则追加，但最多追加_maxTickTickNum次
		while (this.needTick() && tickCount < this._maxTickTickNum) {
			// if (tickCount >= 1) {
			// 	console.log(tickCount);
			// }
			// 执行游戏逻辑更新
			this.update?.();
			//console.log(this.frame)
			// 更新最后一帧的时间
			// 这里加上固定的tick间隔，而不是使用当前时间
			// 这样可以保持tick间隔的稳定性
			this._lastTickTime += Config["game_tick_interval"];

			// 帧数增加
			this.frame++;
			tickCount++;
			this._nowTickTickNum = tickCount;

			// 如果距离上次tick时间已经过去太久（比如页面隐藏后恢复）
			// 确保_lastTickTime不会落后当前时间太多
			if (now - this._lastTickTime > Config["game_tick_interval"] * this._maxTickTickNum) {
				this._lastTickTime = now - Config["game_tick_interval"];
			}
		}

		// 重置当前追加的tick数
		this._nowTickTickNum = 0;
	},

	_tickId: 0,

	startTick() {
		if (this._tickId) {
			console.warn(`已在tick中，id: ${this._tickId}`);
			return;
		}

		// 初始化时间戳
		this._lastTickTime = Date.now();

		// 开始tick循环
		const keepTick = () => {
			this.tick();
			this.tickP = (Date.now() - this._lastTickTime) / (Config.game_tick_interval)
			this._tickId = requestAnimationFrame(keepTick);
		};

		this._tickId = requestAnimationFrame(keepTick);
	},

	stopTick() {
		cancelAnimationFrame(this._tickId);
		this._tickId = 0;
	},

	// 重置系统状态
	reset() {
		this.stopTick();
		this.frame = 0;
		this._lastTickTime = 0;
		this._nowTickTickNum = 0;
	},
};

export { system };