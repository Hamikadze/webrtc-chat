class store {
    constructor() {
        this._eventListeners = {};
        this._log = [];
        //this._onLogChange = onLogChange;
    }

    get log() {
        return this._log;
    }

    push(value) {
        value.time = new Date(value.time);
        this._log.push(value);
        this._eventListeners['newMessage']?.forEach(i => i(value));
        this._eventListeners['newMessages']?.forEach(i => i(this._log));
    }


    addEventListener(type, handler) {
        if (this._eventListeners[type] === undefined)
            this._eventListeners[type] = [];
        this._eventListeners[type].push(handler);
    }

    removeEventListener(type, handler) {
        this._eventListeners[type] = this._eventListeners[type]
            .filter(i => i.toString() !== handler.toString());
    }
}

export const chatHistory_instance = new store();