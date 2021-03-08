import {socket_instance} from "./socket";
import EventListenerClass from "./eventListenerClass";
import {media_instance} from "../storage/mediaStreams";

class webRTC extends EventListenerClass {
    constructor() {
        super();
        this._connectionsCount = 0;

        /* remote peers array (contains peerConnections) */
        this._peers = {};

        /* servers for NAT bypassing */
        this.server = {
            iceServers: [
                /* Servers on heroku using node-turn */
                {
                    url: 'turn:webrtc-chat-api.herokuapp.com:3478',
                    username: 'turnclient',
                    credential: '$0mep@$$w0rd'
                },
                {url: 'stun:webrtc-chat-api.herokuapp.com'},
                /* Servers on own hosting using coturn */
                {
                    url: 'turn:217.150.77.131:3478',
                    username: 'turnclient',
                    credential: '$0mep@$$w0rd'
                },
                {url: 'stun:217.150.77.131:3478'},
                /* Default google stun servers */
                {url: 'stun:stun.l.google.com:19302'},
                {url: 'stun:stun.l.google.com:19302'},
                {url: 'stun:stun1.l.google.com:19302'},
            ]
        };
    }

    /* Return connection count */
    get connectionsCount() {
        return this._connectionsCount;
    }

    /* Sets connection count and calls all methods to handle events */
    set connectionsCount(value) {
        this._connectionsCount = value;
        this._eventListeners['connectionsChange']?.forEach(i => {
            i({
                count: this._connectionsCount,
                peers: this._peers
            })
        });
    }

    /* before unloaded closes channels of all peers */
    onBeforeUnload = () => {
        for (let id in this._peers) {
            if (this._peers.hasOwnProperty(id)) {
                if (this._peers[id].channel !== undefined) {
                    try {
                        this._peers[id].channel.close();
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        }
    }


    /* Processing incoming messages from the socket about webRTC connection */
    socketReceived = ({id, to, type, data}) => {
        //console.log({id, to, type, data});
        switch (type) {
            case "newPeerReceived":
                this.newPeerReceived(id);
                break;
            case "candidate":
                this.remoteCandidateReceived(id, data);
                break;
            case "offer":
                this.remoteOfferReceived(id, data);
                break;
            case "answer":
                this.remoteAnswerReceived(id, data);
                break;
            default:
                console.log(`Unknown type received from socket:`);
                console.log({id, to, type, data});
                break;
        }
    }

    /* Called for the caller to create a new connection */
    newPeerReceived = async (id) => {
        /* Creating new peer connection and adding it to the peers connection array */
        this.createConnection(id);
        const pc = this._peers[id].connection;
        const tracks = this._peers[id].tracks;

        /* Generated candidates by the onicecandidate-handler */
        this.initConnection(id, pc);

        /*
        * Register track handlers
        * Add MediaStreamTracks to the connections
        */
        await this.initMedia(id, tracks, pc);

        /*
        * Generates an offer by calling createOffer()
        * Sets the generated offer as local description
        * Sends the generated offer over the signalling channel to peer
        */
        await pc.createOffer().then(offer => {
            return pc.setLocalDescription(offer).then(() => {
                socket_instance.sendRTCOverSocket(id, "offer", offer);
            }).catch(error => console.error('Error set local description', error));
        }).catch(error => console.error('Error create offer', error));
    }

    /* Receives the answer from remote peer and set remote description */
    remoteAnswerReceived = async (id, answer) => {
        const pc = this._peers[id].connection;
        await pc.setRemoteDescription(answer).catch(error => console.error('Error set remote description', error));
    }

    /* Receives ice candidates the remote peer */
    remoteCandidateReceived = async (id, candidate) => {
        this.createConnection(id);
        const pc = this._peers[id].connection;
        await pc.addIceCandidate(candidate)
            .catch(error => console.error('Error add iceCandidate', error));
    }


    /* Called for the receiver to create a new connection */
    remoteOfferReceived = async (id, offer) => {
        /* Creating new peer connection and adding it to the peers connection array */
        this.createConnection(id);
        const pc = this._peers[id].connection;
        const tracks = this._peers[id].tracks;

        /*
        * Register track handlers
        * Add MediaStreamTracks to the connections
        */
        await this.initMedia(id, tracks, pc);

        /* Generated candidates by the onicecandidate-handler */
        this.initConnection(id, pc);

        /*
        * Receives the offer and sets it like remote description
        * Creates an sdp answer
        * Sets the answer as local description
        * Sends the answer to calling peer
        */
        await pc.setRemoteDescription(offer).then(() => {
            pc.createAnswer().then(answer => {
                return pc.setLocalDescription(answer).then(() => {
                    socket_instance.sendRTCOverSocket(id, "answer", answer);
                }).catch(error => console.error('Error set local description', error));
            }).catch(error => console.error('Error create answer', error));
        }).catch(error => console.error('Error set remote description', error));
    }

    /* Generated candidates by the onicecandidate-handler */
    initConnection = (id, pc) => {
        /* Generated candidates by the onicecandidate-handler and sends it to peer throw socket */
        pc.onicecandidate = function (event) {
            if (event.candidate)
                socket_instance.sendRTCOverSocket(id, "candidate", event.candidate);
        }

        /* Monitors connection state change */
        pc.oniceconnectionstatechange = (event) => {
            switch (pc.iceConnectionState) {
                /*
                * Decrease RTC connections count, removes peer from peers array and
                * removes tracks by peer id from media streams
                */
                case 'disconnected': {
                    delete this._peers[id];
                    media_instance.removeStream(id);
                    this.connectionsCount = this.connectionsCount - 1;
                    console.log(`[${id}] disconnected. Peers: ${this.connectionsCount}`);
                    break;
                }
                /* Increase RTC connections count */
                case 'connected': {
                    this.connectionsCount = this.connectionsCount + 1;
                    console.log(`[${id}] connected. Peers: ${this.connectionsCount}`);
                    break;
                }

                default:
                    console.log(pc.iceConnectionState);
                    break;
            }
        }

        /* The block is disabled until better times when I
         finish tracking access to camera permission

        pc.onnegotiationneeded = async function (event) {
            if (pc.signalingState !== "stable") return;
            pc.createOffer().then(offer => {
                pc.setLocalDescription(offer).then(() => {
                    socket_instance.sendRTCOverSocket(id, 'offer', pc.localDescription);
                }).catch(error => console.error('Error set local description', error));
            }).catch(error => console.error('Error create offer', error));
        }         */
    }

    /*
    * Initializes onTrack event and adding media stream to track
    * If the user has allowed access to the microphone and camera
    * adds tracks to the connection tracks
    */
    initMedia = async (id, tracks, pc) => {
        pc.ontrack = function ({streams: [stream]}) {
            console.log([id, stream]);
            media_instance.addStream(id, stream);
        }

        if (media_instance.localStream !== undefined)
            media_instance.localStream.getTracks().forEach(track => {
                console.log('Adding new track', [pc, track]);
                if (!tracks.includes(track)) {
                    tracks.push(track);
                    pc.addTrack(track, media_instance.localStream);
                }
            })
    }

    /*
    * Initializes a new connection
    * connection individual for each peer
    */
    createConnection = (id) => {
        if (this._peers[id] === undefined) {
            this._peers[id] = {};
            this._peers[id].tracks = [];
            this._peers[id].connection =
                new RTCPeerConnection(this.server);
            console.log(this._peers[id]);
        }
    }
}

export const webRTC_instance = new webRTC();
