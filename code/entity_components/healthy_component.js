import { Component } from "./component.js";

class HealthyComponent extends Component {
    constructor(data) {
        super("th:hp", data);
        if (typeof data === "object") {this.maxHp = data.maxHp || Infinity;
            this.hp = data.hp || data.maxHp;
        } else {
            this.hp = data;
            this.maxHp = Infinity;
        }
        
    }

    get value() {
        return this.hp;
    }

    set value(v) {
        if (v > this.maxHp) v = this.maxHp;
        this.hp = v;
    }
}
Component.registerComponent("th:hp", HealthyComponent);

export { HealthyComponent };