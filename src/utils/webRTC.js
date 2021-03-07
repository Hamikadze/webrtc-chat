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
    const {id, name, room} = data;
    console.log('Creating new peer', [user, data]);
    createConnection(id);
    const pc = webRTC_instance.peers[id].connection;

    initConnection(id, pc);

    await initMedia(id, pc);
    await pc.createOffer().then(offer => {
        return pc.setLocalDescription(offer).then(() => {
            socket_instance.sendRTCOverSocket(id, "offer", offer);
        }).catch(error => console.error('Error set local description', error));
    }).catch(error => console.error('Error create offer', error));


}

export function socketReceived({id, to, type, data}) {
    //console.log({id, to, type, data});
    switch (type) {
        case "candidate":
            remoteCandidateReceived(id, data);
            break;
        case "offer":
            remoteOfferReceived(id, data);
            break;
        case "answer":
            remoteAnswerReceived(id, data);
            break;
        default:
            console.log(`Unknown type received from socket:`);
            console.log({id, to, type, data});
            break;
    }
}

export async function remoteAnswerReceived(id, answer) {
    const pc = webRTC_instance.peers[id].connection;
    await pc.setRemoteDescription(answer).catch(error => console.error('Error set remote description', error));
}

export async function remoteCandidateReceived(id, candidate) {
    createConnection(id);
    const pc = webRTC_instance.peers[id].connection;
    await pc.addIceCandidate(candidate)
        .catch(error => console.error('Error add iceCandidate', error));
}

export async function remoteOfferReceived(id, offer) {
    createConnection(id);
    const pc = webRTC_instance.peers[id].connection;
    await initMedia(id, pc);

    initConnection(id, pc);

    await pc.setRemoteDescription(offer).then(() => {
        pc.createAnswer().then(answer => {
            return pc.setLocalDescription(answer).then(() => {

                socket_instance.sendRTCOverSocket(id, "answer", answer);
            })
                .catch(error => console.error('Error set local description', error));
        }).catch(error => console.error('Error create answer', error));
    }).catch(error => console.error('Error set remote description', error));


}

function initConnection(id, pc) {
    pc.onicecandidate = function (event) {
        if (event.candidate)
            socket_instance.sendRTCOverSocket(id, "candidate", event.candidate);
    }

    pc.oniceconnectionstatechange = function (event) {
        switch (pc.iceConnectionState) {
            case 'disconnected': {
                delete webRTC_instance.peers[id];
                media_instance.removeStream(id);
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

async function initMedia(id, pc) {
    pc.ontrack = function ({streams: [stream]}) {
        media_instance.addStream(id, stream);
    }

    if (media_instance.localStream !== undefined)
        media_instance.localStream.getTracks().forEach(track => {
            pc.addTrack(track, media_instance.localStream);
        })
}

function createConnection(id) {
    if (webRTC_instance.peers[id] === undefined) {
        webRTC_instance.peers[id] = {};
        webRTC_instance.peers[id].connection =
            new RTCPeerConnection(webRTC_instance.server);
    }
}
