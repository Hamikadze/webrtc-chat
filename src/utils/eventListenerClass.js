export default class EventListenerClass{
    constructor() {
        this._eventListeners = {};
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