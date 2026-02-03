import { GameObject } from "./game_object.js";
import { Vector2 } from "./position.js";

class Animation2DManager {
    /**
     * 
     * @param {GameObject} obj 需要添加动画的对象
     * @param {THREE.Texture} sheet THREE.Texture对象
     * @param {Object} opts 
     */
    constructor(obj) {
        this.object = obj; // 保存对象引用

        this.sheets = new Map();

        this.playingSheet = null;
        this.playing = false;

        this.lastUpdateTextureTick = 0;
        this.sheetWidth = 1;
        this.sheetHeight = 1;
        // 这里的Frame指repeat和offset的对象
        this.playFrame = 0;
    }

    _getFrame(num) {
        if (!this.playingSheet) return {
            repeat: new Vector2,
            offset: new Vector2,
        };
        const y = num % this.sheetWidth;
        const x = num - num % this.sheetWidth;

        return {
            repeat: new Vector2(1 / this.sheetWidth, 1 / this.sheetHeight),
            offset: new Vector2(x, y)
        }
    }

    addSheet(name, texture, opt) {
        this.sheets.set(name, {
            texture: texture,
            ...opt
        });
    }

    removeSheet(name) {
        this.sheets.delete(name);
    }

    switchSheet(name) {
        if (!this.sheets.has(name)) throw new Error(`"${name}"动画未被添加`);
        const sheet = this.sheets.get(name);
        const text = sheet.texture;
        const width = sheet.width || 1;
        const height = sheet.height || 1;

        this.playingSheet = sheet;
        this.sheetHeight = height;
        this.sheetWidth = width;
    }

    // 在这里播放动画
    play() {
        if (!this.playingSheet) return;
        this.playing = true; // 更新状态
    }

    // 在这里更新动画刻
    update(tick) {
        let sheet = this.playingSheet;
        const interval = sheet.interval;
        if (tick >= sheet.interval) {
            this.lastUpdateTextureTick = tick;
            this.playFrame++;
        }
    }
}

export { Animation2DManager }