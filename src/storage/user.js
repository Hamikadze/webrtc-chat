import {uuid} from "../utils/uuid";

class user {
    constructor() {
        /* construct user data and generate or parse room id from url params */
        this._user = {id: '', name: '', room: this.roomId};
    }

    get user() {
        return this._user;
    }

    set user(value) {
        this._user = value;
        console.log('Logged', this._user);
    }

    /*
    * generate room id if url params is empty or parse room id from url params
    * params should be ?room=[room_id]
    */
    get roomId() {
        if (this._user === undefined || this._user.room === undefined) {
            const url = new URL(window.location.href);
            const urlParams = new URLSearchParams(url.search);
            let room = urlParams.get('room')
            if (!room) {
                room = uuid();
                urlParams.append('room', room);
                window.location.search = urlParams;
            }
            return room;
        } else {
            return this._user.room;
        }
    }
}

export const user_instance = new user();