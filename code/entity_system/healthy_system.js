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

    updateEntity(entity, hp) {
        if (hp <= 0) {
            entity.die();
        }
    }

    update() {
        const entities = Entity.getAllEntities();
        for (const entity of entities) {
            const hpComponent = entity.getComponent("th:hp");
            if (!hpComponent) continue;
            const hp = hpComponent.value || 0;
            this.updateEntity(entity, hp);
        }
    }
}

new HealthySystem();

export { HealthySystem };