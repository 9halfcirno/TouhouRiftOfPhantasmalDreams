class System {
    constructor(opts = {}) {
        this.name = opts.name || "UnnamedSystem";
        const requires = opts.requireComponents || [];
        this.requireComponents = requires;
        this.priority = opts.priority || 0;

        System.registerSystem(this);
    }

    static registerSystem(system) {
        // if (this.allSystems.has(system.name)) {
        //     console.warn(`系统已存在，名称: ${system.name}`);
        //     return;
        // }

        System.allSystems.push(system);
        // 按优先级排序，数字越小优先级越高
        System.allSystems.sort((sys1, sys2) => sys1.priority - sys2.priority);
    }

    static updateAll() {
        for(let i = 0, n = System.allSystems.length; i < n; i++) {
            const system = System.allSystems[i];
            system.update();
        }
    }
}

System.allSystems = [];

export { System };