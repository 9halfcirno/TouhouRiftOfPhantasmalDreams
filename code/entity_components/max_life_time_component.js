import { Component } from "./component.js";

class MaxLifeTimeComponent extends Component {
    constructor(data) {
        super("th:max_life_time", data);
    }

    get value() {
        return this.data;
    }

    set value(val) {
        this.data = val
    }
}

Component.registerComponent("th:max_life_time", MaxLifeTimeComponent);

export { MaxLifeTimeComponent }