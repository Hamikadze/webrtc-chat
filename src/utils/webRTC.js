import {socket_instance} from "./socket";
import EventListenerClass from "./eventListenerClass";
import {user_instance} from "../storage/user";


class webRTC extends EventListenerClass {
    constructor() {
        super();
        this._streams = {};
        this._eventListeners = {};
        this._connectionsCount = 0;
        this.peers = {};
        this.server = {
            iceServers: [
                {url: 'turn:webrtc-chat-api.herokuapp.com:3478'},
                {url: 'stun:webrtc-chat-api.herokuapp.com'},
                {url: 'stun:stun.l.google.com:19302'},
                {
                    url: 'turn:217.150.77.131:3478',
                    username: 'turnclient',
                    credential: '$0mep@$$w0rd'
                },
                {url: 'stun:217.150.77.131:3478'},
                {url: 'stun:stun.l.google.com:19302'},
                {url: 'stun:stun1.l.google.com:19302'},
            ]
        };
        console.log('webRTC created!');
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

    addStream(id, stream) {
        this._streams[id] = stream;
        this._eventListeners[`streamAdded-${id}`]?.forEach(i => {
            if (this._streams[id] !== undefined)
                i(this._streams[id])
        });
    }

    getStream(id) {
        return this._streams[id];
    }

    onBeforeUnload = () => {
        for (let id in webRTC_instance.peers) {
            if (webRTC_instance.peers.hasOwnProperty(id)) {
                if (webRTC_instance.peers[id].channel !== undefined) {
                    try {
                        webRTC_instance.peers[id].channel.close();
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        }
    }
}

export const webRTC_instance = new webRTC();


export async function webRTC_newPeer({user, data}) {
    if (user !== 'SERVER')
        return;

    console.log('Creating new peer', [user, data]);
    createConnection(data.id);
    const pc = webRTC_instance.peers[data.id].connection;

    await initMedia(data.id, pc);
    await pc.createOffer().then(offer => {
        return pc.setLocalDescription(offer)
            .catch(error => console.error('Error set local description', error));
    }).catch(error => console.error('Error create offer', error));
    initConnection(data.id, "offer", pc);
}

export function socketReceived(data) {
    const json = JSON.parse(data);
    console.log('socketReceived:', json);
    switch (json.type) {
        case "candidate":
            remoteCandidateReceived(json.id, json.data);
            break;
        case "offer":
            remoteOfferReceived(json.id, json.data);
            break;
        case "answer":
            remoteAnswerReceived(json.id, json.data);
            break;
        default:
            console.log(`Unknown type received from socket:`);
            console.log(json);
            break;
    }
}

export async function remoteAnswerReceived(id, answer) {
    console.log('Remote answer received', [id, answer]);

    const pc = webRTC_instance.peers[id].connection;
    await pc.setRemoteDescription(answer).catch(error => console.error('Error set remote description', error));
}

export async function remoteCandidateReceived(id, candidate) {
    console.log('Remote offer received', [id, candidate])

    createConnection(id);
    const pc = webRTC_instance.peers[id].connection;
    await pc.addIceCandidate(candidate)
        .catch(error => console.error('Error add iceCandidate', error));
}

export async function remoteOfferReceived(id, offer) {
    console.log('Remote offer received', [id, offer]);

    createConnection(id);
    const pc = webRTC_instance.peers[id].connection;
    await initMedia(id, pc);
    await pc.setRemoteDescription(offer).then(() => {
        pc.createAnswer().then(answer => {
            return pc.setLocalDescription(answer)
                .catch(error => console.error('Error set local description', error));
        }).catch(error => console.error('Error create answer', error));
    }).catch(error => console.error('Error set remote description', error));

    initConnection(id, "answer", pc);
}

function initConnection(id, sdpType, pc) {
    pc.onicecandidate = function (event) {
        socket_instance.sendRTCOverSocket(id, "candidate", event.candidate);
    }

    pc.oniceconnectionstatechange = function (event) {
        switch (pc.iceConnectionState) {
            case 'disconnected': {
                delete webRTC_instance.peers[id];
                webRTC_instance.connectionsCount = webRTC_instance.connectionsCount - 1;
                console.log(`[${id}] disconnected! Peers: ${webRTC_instance.connectionsCount}`);
                break;
            }
            case 'connected': {
                webRTC_instance.connectionsCount = webRTC_instance.connectionsCount + 1;
                console.log(`[${id}] connected! Peers: ${webRTC_instance.connectionsCount}`);
                break;
            }
            default:
                console.log(pc.iceConnectionState);
                break;
        }
    }

    pc.onnegotiationneeded = async function (event) {
        if (pc.signalingState !== "stable") return;
        pc.createOffer().then(offer => {
            pc.setLocalDescription(offer).then(() => {
                socket_instance.sendRTCOverSocket(id, sdpType, pc.localDescription);
            }).catch(error => console.error('Error set local description', error));
        }).catch(error => console.error('Error create offer', error));
    }
}

async function initMedia(id, pc) {

    pc.ontrack = function ({streams: [stream]}) {
        webRTC_instance.addStream(id, stream);
    }

    const localVideo = document.getElementById(`video-${user_instance.user.id}`);
    if (localVideo) {
        localVideo.srcObject = user_instance.localStream;
    }
    user_instance.localStream.getTracks().forEach(track => {
        pc.addTrack(track, user_instance.localStream);
    });
}

function createConnection(id) {
    if (webRTC_instance.peers[id] === undefined) {
        webRTC_instance.peers[id].connection =
            new RTCPeerConnection(/*webRTC_instance.server, options*/);
    }
}
