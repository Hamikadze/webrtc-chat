import {uuid} from "../utils/uuid";

class user {
    constructor() {
        this._eventListeners = {};
        this._user = {id: '', name: '', room: this.roomId};
        this._localStream = null;
    }

    get localStream() {
        return this._localStream;
    }

    set localStream(value) {
        this._localStream = value;
    }

    get user() {
        return this._user;
    }

    set user(value) {
        this._user = value;
    }

    get roomId() {
        let room = window.location.pathname.substr(1);
        if (!room) {
            room = uuid();
            window.location = room;
        }
        return room;
    }
}

export const user_instance = new user();