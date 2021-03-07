/*
Extensible type for tracking changes in objects
Works on th events
another object subscribes to the type of event and passes functions for processing
 */
export default class EventListenerClass {
    constructor() {
        this._eventListeners = {};
    }

    /*
    add event listener to event listeners object
     */
    addEventListener(type, handler) {
        if (this._eventListeners[type] === undefined)
            this._eventListeners[type] = [];
        this._eventListeners[type].push(handler);
    }

    /*
    remove event from event listeners
    if there are no more event in event listeners delete this type
     */
    removeEventListener(type, handler) {
        if (this._eventListeners[type] !== undefined){
            this._eventListeners[type] = this._eventListeners[type]
                .filter(i => i.toString() !== handler.toString());
            if(this._eventListeners[type].length === 0)
                delete this._eventListeners[type];
        }
    }
}