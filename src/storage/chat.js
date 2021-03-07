import EventListenerClass from "../utils/eventListenerClass";

class chat  extends EventListenerClass{
    constructor() {
        super();
        this._log = [];
    }

    get log() {
        return this._log;
    }

    /*
    * Adding new message to chatHistory
    * when message is added calls all methods to handle events
     */
    push(value) {
        value.data.time = new Date(value.data.time);
        this._log.push(value);
        this._eventListeners['newMessage']?.forEach(i => i(value));
        this._eventListeners['newMessages']?.forEach(i => i(this._log));
    }
}

export const chat_instance = new chat();