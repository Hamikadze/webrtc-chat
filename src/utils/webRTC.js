import {socket_instance} from "./socket";
import EventListenerClass from "./eventListenerClass";
import {media_instance} from "../storage/mediaStreams";

class webRTC extends EventListenerClass {
    constructor() {
        super();
        this._eventListeners = {};
        this._connectionsCount = 0;
        this.peers = {};
        this.server = {
            iceServers: [
                //Сервер на heroku с использованием node-turn
                {
                    url: 'turn:webrtc-chat-api.herokuapp.com:3478',
                    username: 'turnclient',
                    credential: '$0mep@$$w0rd'
                },
                {url: 'stun:webrtc-chat-api.herokuapp.com'},
                //Сервер на собственном сервере с использованием coturn
                {
                    url: 'turn:217.150.77.131:3478',
                    username: 'turnclient',
                    credential: '$0mep@$$w0rd'
                },
                {url: 'stun:217.150.77.131:3478'},
                //Google stun сервера
                {url: 'stun:stun.l.google.com:19302'},
                {url: 'stun:stun.l.google.com:19302'},
                {url: 'stun:stun1.l.google.com:19302'},
            ]
        };
    }

    get connectionsCount() {
        return this._connectionsCount;

    }

    set connectionsCount(value) {
        this._connectionsCount = value;
        this._eventListeners['connectionsChange']?.forEach(i => {
            i({
                count: this._connectionsCount,
                peers: this.peers.keys
            })
        });
    }

    onBeforeUnload = () => {
        for (let id in this.peers) {
            if (this.peers.hasOwnProperty(id)) {
                if (this.peers[id].channel !== undefined) {
                    try {
                        this.peers[id].channel.close();
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        }
    }

    webrtcNewPeer = async ({user, data}) => {
        if (user !== 'SERVER')
            return;
        const {id, name, room} = data;
        console.log('Creating new peer', [user, data]);
        this.createConnection(id);
        const pc = this.peers[id].connection;

        this.initConnection(id, pc);

        await this.initMedia(id, pc);
        await pc.createOffer().then(offer => {
            return pc.setLocalDescription(offer).then(() => {
                socket_instance.sendRTCOverSocket(id, "offer", offer);
            }).catch(error => console.error('Error set local description', error));
        }).catch(error => console.error('Error create offer', error));


    }

    socketReceived = ({id, to, type, data}) => {
        //console.log({id, to, type, data});
        switch (type) {
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

    remoteAnswerReceived = async (id, answer) => {
        const pc = this.peers[id].connection;
        await pc.setRemoteDescription(answer).catch(error => console.error('Error set remote description', error));
    }

    remoteCandidateReceived = async (id, candidate) => {
        this.createConnection(id);
        const pc = this.peers[id].connection;
        await pc.addIceCandidate(candidate)
            .catch(error => console.error('Error add iceCandidate', error));
    }

    remoteOfferReceived = async (id, offer) => {
        this.createConnection(id);
        const pc = this.peers[id].connection;
        await this.initMedia(id, pc);
        this.initConnection(id, pc);
        await pc.setRemoteDescription(offer).then(() => {
            pc.createAnswer().then(answer => {
                return pc.setLocalDescription(answer).then(() => {
                    socket_instance.sendRTCOverSocket(id, "answer", answer);
                }).catch(error => console.error('Error set local description', error));
            }).catch(error => console.error('Error create answer', error));
        }).catch(error => console.error('Error set remote description', error));
    }

    initConnection = (id, pc) => {
        pc.onicecandidate = function (event) {
            if (event.candidate)
                socket_instance.sendRTCOverSocket(id, "candidate", event.candidate);
        }


        pc.oniceconnectionstatechange = (event) => {
            switch (pc.iceConnectionState) {
                case 'disconnected': {
                    delete this.peers[id];
                    media_instance.removeStream(id);
                    this.connectionsCount = this.connectionsCount - 1;
                    console.log(`[${id}] disconnected. Peers: ${this.connectionsCount}`);
                    break;
                }
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

    //Initializes onTrack event and adding media stream to track
    initMedia = async (id, pc) => {
        pc.ontrack = function ({streams: [stream]}) {
            media_instance.addStream(id, stream);
        }

        if (media_instance.localStream !== undefined)
            media_instance.localStream.getTracks().forEach(track => {
                pc.addTrack(track, media_instance.localStream);
            })
    }

    //Initializes a new connection
    createConnection = (id) => {
        if (this.peers[id] === undefined) {
            this.peers[id] = {};
            this.peers[id].connection =
                new RTCPeerConnection(this.server);
        }
    }
}

export const webRTC_instance = new webRTC();
