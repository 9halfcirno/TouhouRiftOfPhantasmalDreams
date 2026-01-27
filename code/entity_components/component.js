class Component {
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }

    get value() {
        throw new Error("获取 value 方法未实现");
    }

    set value(newValue) {
        throw new Error("设置 value 方法未实现");
    }

    static createComponent(type, data) {
        const ComponentClass = this.components.get(type);
        if (!ComponentClass) {
            throw new Error(`未注册的组件类型: ${type}`);
        }
        return new ComponentClass(data);
    }
    static registerComponent(type, componentClass) {
        this.components.set(type, componentClass);
    }
}

Component.components = new Map();

export { Component }