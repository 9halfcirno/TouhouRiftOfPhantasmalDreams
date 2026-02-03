import { Entity } from "../game_entity.js";
import { System } from "./system.js";

class HealthySystem extends System {
    constructor() {
        super({
            name: "HealthySystem",
            requireComponents: ["th:hp"],
            priority: 1
        });
    }

    update() {
        const entities = Entity.getAllEntities();
        for (const entity of entities) { // 检查生命值
            if (entity.hasComponent("th:hp")) {
                const hpComponent = entity.getComponent("th:hp");
                const hp = hpComponent.value || 0;
                if (hp <= 0) entity.die();
            }

            // 检查最大存活时间
            if (entity.hasComponent("th:max_life_time")) {
                const time = entity.getComponent("th:max_life_time").value;
                if (THSystem.frame - entity.summonTime > time) entity.die();
            }
        }
    }
}

new HealthySystem();

export { HealthySystem };