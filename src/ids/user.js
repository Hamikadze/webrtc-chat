import {uuid} from "./uuid";

class user {
    constructor() {
        this._eventListeners = {};
        this._userId = uuid();
    }


    get id() {
        return this._userId;
    }

    set id(value) {
        this._userId = value;
        this._eventListeners['logged']?.forEach(e => e(this._userId));
    }

    addEventListener(type, handler) {
        if (this._eventListeners[type] === undefined)
            this._eventListeners[type] = [];
        this._eventListeners[type].push(handler);
    }

    removeEventListener(type, handler) {
        if (this._eventListeners[type] !== undefined)
            this._eventListeners[type] = this._eventListeners[type]
                .filter(i => i.toString() !== handler.toString());
    }
}

export default new user();