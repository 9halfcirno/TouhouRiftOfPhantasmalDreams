import { Entity } from "../game_entity.js";
import { System } from "./system.js";

class BulletMovementSystem extends System {
    constructor() {
        super({
            name: "BulletMovementSystem",
            priority: 2,
        });
    }

    update() {
        const entities = Entity.getAllEntities();

        for (const entity of entities) {
            if (entity.getComponent("th:family").value === "bullet") {
                entity.step(entity.rotation);
            }
        }
    }
}

//new BulletMovementSystem();

export { BulletMovementSystem }