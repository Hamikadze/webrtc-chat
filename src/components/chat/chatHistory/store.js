import EventListenerClass from "../../../utils/eventListenerClass";

class store  extends EventListenerClass{
    constructor() {
        super();
        this._eventListeners = {};
        this._log = [];
        //this._onLogChange = onLogChange;
    }

    get log() {
        return this._log;
    }

    push(value) {
        value.data.time = new Date(value.data.time);
        this._log.push(value);
        this._eventListeners['newMessage']?.forEach(i => i(value));
        this._eventListeners['newMessages']?.forEach(i => i(this._log));
    }
}

export const chatHistory_instance = new store();