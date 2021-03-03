class store {
    constructor() {
        this._eventListeners = {};
        this._users = [];
        //this._onLogChange = onLogChange;
    }

    get users() {
        return this._users;
    }

    push(value) {
        this._users.push(value);
        this._eventListeners['usersChange']?.forEach(i => i(value));
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

export const userList_instance = new store();