import EventListenerClass from "../utils/eventListenerClass";

class mediaStreams extends EventListenerClass {
    constructor() {
        super();
        this._id = null;
        this._localStream = undefined;
        this.getUserMedia().then(stream => {
            this._localStream = stream;
        })
            .catch(error => console.error('Error get user media', error));
        this._streams = {};
    }

    get localId() {
        return this._id;
    }

    set localId(value) {
        this._id = value;
        this.addStream(value, this._localStream);
    }

    get localStream() {
        return this._localStream;
    }

    getUserMedia() {
        return navigator.mediaDevices.getUserMedia({video: true, audio: true});
    }

    addStream(id, stream) {
        this._streams[id] = stream;
        this._eventListeners[`streamAdded-${id}`]?.forEach(i => {
            if (this._streams[id] !== undefined)
                i(this._streams[id])
        });
        if (this._id === id) {
            this._localStream = this._streams[id];
        }
    }

    getAudioTrack(id, type) {
        let track;
        if (this._streams[id] === undefined) {
            console.warn('Stream doesn\'t exist', id)
            return undefined;
        }
        switch (type) {
            case 'audio':
                track = this._streams[id].getAudioTracks()[0];
                break;
            case 'video':
                track = this._streams[id].getVideoTracks()[0];
                break;
            default:
                console.warn('Unknown stream type', type);
                return undefined;
        }
        return track;
    }

    getState(id, type) {
        return this.getAudioTrack(id, type) ?? {enabled: false};
    }

    toggleStream(id, type) {
        let track = this.getAudioTrack(id, type);
        if (track !== undefined) {
            track.enabled = !track.enabled;
            this._eventListeners[`streamToggled-${id}`]?.forEach(i => {
                if (this._streams[id] !== undefined)
                    i(this._streams[id])
            });
        }
        return track ?? {enabled: false};
    }

    removeStream(id) {
        if (this._streams[id] !== undefined)
            delete this._streams[id];
    }

    getStream(id) {
        console.log(id);
        console.log(this._streams);
        console.log(this._streams[id]);
        return this._streams[id];
    }
}

export const media_instance = new mediaStreams();