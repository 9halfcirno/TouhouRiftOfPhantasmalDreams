import { Component } from "./component.js";

class SpeedComponent extends Component {
    constructor(data) {
        super("th:speed", data);
        this.speed = data || 0;
    }

    get value() {
        return this.speed;
    }

    set value(v) {
        this.speed = v;
    }
}
Component.registerComponent("th:speed", SpeedComponent);

export { SpeedComponent };