import {uuid} from "./uuid";

class room{
    constructor() {
        this._roomId = uuid();
        const tempRoom = window.location.hash.substr(1);
        if (tempRoom) {
            this._roomId = tempRoom;
        }
    }

    get id(){
        return this._roomId;
    }
}

export default new room();