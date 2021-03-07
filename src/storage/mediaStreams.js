import EventListenerClass from "../utils/eventListenerClass";

class mediaStreams extends EventListenerClass {
    constructor() {
        super();
        this._id = null;
        /* local media stream from user */
        this._localStream = undefined;
        /* Setting local media stream from user media device */
        this.getUserMedia().then(stream => {
            this._localStream = stream;
        }).catch(error => console.error('Error get user media', error));
        /* all streams from users in room include localStream (stream with local user.id) */
        this._streams = {};
    }

    /* Equivalent to user.id need to found localStream */
    get localId() {
        return this._id;
    }
    /* set local id and add localStream to all streams */
    set localId(value) {
        this._id = value;
        this.addStream(value, this._localStream);
    }

    get localStream() {
        return this._localStream;
    }

    /* return user media device with audio and video track */
    getUserMedia() {
        return navigator.mediaDevices.getUserMedia({video: true, audio: true});
    }

    /*
    * add new stream from peer or user to media streams
    * when stream is added calls all methods to handle events
    * set localStream if local id is setted
    */
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

    /*
    get track from stream based on track type [audio, video] and peer id
    return undefined when stream doesn't exist
     */
    getTrack(id, type) {
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

    /*
    * get track state (enabled or not)
    * disabled tracks contains no data to transfer
    * if track doesn't exist return disabled state
    */
    getState(id, type) {
        return this.getTrack(id, type) ?? {enabled: false};
    }

    /*
    * toggle track state to turn off or on for video or audio
    * if track doesn't exist return disabled state by default
    * if the track was added, call the events associated with it
    */
    toggleStream(id, type) {
        let track = this.getTrack(id, type);
        if (track !== undefined) {
            track.enabled = !track.enabled;
            this._eventListeners[`streamToggled-${id}`]?.forEach(i => {
                if (this._streams[id] !== undefined)
                    i(this._streams[id])
            });
        }
        return track ?? {enabled: false};
    }

    /* remove track from streams */
    removeStream(id) {
        if (this._streams[id] !== undefined)
            delete this._streams[id];
    }

    /* get track from streams based on peer or local id */
    getStream(id) {
        return this._streams[id];
    }
}

export const media_instance = new mediaStreams();