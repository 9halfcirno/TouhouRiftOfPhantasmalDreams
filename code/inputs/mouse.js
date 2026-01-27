const Mou = {
    left: false,
    right: false,
    middle: false,
    wheel: {},
    movement: {
        x: 0,
        y: 0,
        z: 0
    },
    _lastPosition: {
        x: 0,
        y: 0
    },
    x: 0,
    y: 0,
    _wheelCallbacks: [],
    _buttonCallbacks: new Map(),
    onWheel(cb) {
        this._wheelCallbacks.push(cb);
    },
    offWheel(cb) {
        const index = this._wheelCallbacks.indexOf(cb);
        if (index !== -1) {
            this._wheelCallbacks.splice(index, 1);
        }
    },
    onButton(button, cb) {
        if (!this._buttonCallbacks.has(button)) {
            this._buttonCallbacks.set(button, []);
        }
        this._buttonCallbacks.get(button).push(cb);
    },
    offButton(button, cb) {
        if (!this._buttonCallbacks.has(button)) return;
        const arr = this._buttonCallbacks.get(button);
        const index = arr.indexOf(cb);
        if (index !== -1) {
            arr.splice(index, 1);
        }
    },
}

window.addEventListener("mousedown", event => {
    switch (event.button) {
        case 0:
            Mou.left = true;
            break;
        case 1:
            Mou.middle = true;
            break;
        case 2:
            Mou.right = true;
            break;
    }
})

window.addEventListener("mouseup", event => {
    switch (event.button) {
        case 0:
            Mou.left = false;
            break;
        case 1:
            Mou.middle = false;
            break;
        case 2:
            Mou.right = false;
            break;
    }
})

window.addEventListener("wheel", event => {
    Mou.wheel.x = event.deltaX;
    Mou.wheel.y = event.deltaY;
    Mou.wheel.z = event.deltaZ; 
    Mou._wheelCallbacks.forEach(cb => {
        cb(Mou.wheel);
    });
})

window.addEventListener("mousemove", event => {
    let [x, y] = [event.clientX, event.clientY];
    Mou.movement.x = x - Mou._lastPosition.x;
    Mou.movement.y = y - Mou._lastPosition.y;

    Mou._lastPosition.x = x;
    Mou._lastPosition.y = y;
})


export {Mou as MouseInput}