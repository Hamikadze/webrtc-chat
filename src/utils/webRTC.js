import {sendRTCOverSocket} from "./socket";
import {chatHistory_instance} from "../components/chat/chatHistory/store";


class webRTC {

    constructor() {
        this._eventListeners = {};
        this._connectionsCount = 0;
        this.peers = {};
        this.server = {
            iceServers: [
                {url: "stun:stun.l.google.com:19302"},
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

export const webRTC_instance = new webRTC();


export function socketReceived(data) {
    const json = JSON.parse(data);
    console.log(`socketReceived:`);
    console.log(json);
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

export function remoteAnswerReceived(id, data) {
    console.log(`Setting remote answer from ${id}`);
    console.log(data);
    const pc = webRTC_instance.peers[id].connection;
    pc.setRemoteDescription(new RTCSessionDescription(data)).catch(error => {
        console.error('Set remote description failed: ', error)
    });
}

export function remoteCandidateReceived(id, data) {
    createConnection(id);
    const pc = webRTC_instance.peers[id].connection;
    pc.addIceCandidate(new RTCIceCandidate(data)).catch(error => {
        console.error('Add ice candidate failed: ', error)
    });
}

export function remoteOfferReceived(id, data) {
    createConnection(id);
    const pc = webRTC_instance.peers[id].connection;

    pc.setRemoteDescription(new RTCSessionDescription(data)).catch(error => {
        console.error('Set remote description failed: ', error)
    });
    pc.createAnswer().then(answer => {
        pc.setLocalDescription(answer).catch(error => {
            console.error('Set local description failed: ', error)
        });
    }).catch(error => {
        console.error('Send answer failed: ', error)
    });
}

export function socketNewPeer(id) {
    console.log(`socketNewPeer ${id}`);
    webRTC_instance.peers[id] = {
        candidateCache: []
    };

    // Создаем новое подключение
    const pc = new RTCPeerConnection(webRTC_instance.server/*, options*/);
    // Инициализирууем его
    initConnection(pc, id, "offer");

    // Сохраняем пира в списке пиров
    webRTC_instance.peers[id].connection = pc;

    // Создаем DataChannel по которому и будет происходить обмен сообщениями
    const channel = pc.createDataChannel("mychannel", {});
    channel.owner = id;
    webRTC_instance.peers[id].channel = channel;

    // Устанавливаем обработчики событий канала
    bindEvents(channel);

    // Создаем SDP offer
    pc.createOffer().then(offer => {
        pc.setLocalDescription(offer).catch(error => {
            console.error('Set local description failed: ', error)
        });
    }).catch(error => {
        console.error('Send offer failed: ', error)
    });
}

export function onBeforeUnload(e) {
    for (let id in webRTC_instance.peers) {
        if (webRTC_instance.peers.hasOwnProperty(id)) {
            if (webRTC_instance.peers[id].channel !== undefined) {
                try {
                    webRTC_instance.peers[id].channel.close();
                } catch (e) {
                }
            }
        }
    }
}

function initConnection(pc, id, sdpType) {
    pc.onicecandidate = function (event) {
        if (event.candidate) {
            // При обнаружении нового ICE кандидата добавляем его в список для дальнейшей отправки
            webRTC_instance.peers[id].candidateCache.push(event.candidate);
        } else {
            // Когда обнаружение кандидатов завершено, обработчик будет вызван еще раз, но без кандидата
            // В этом случае мы отправялем пиру сначала SDP offer или SDP answer (в зависимости от параметра функции)...
            sendRTCOverSocket(sdpType, pc.localDescription, id);
            // ...а затем все найденные ранее ICE кандидаты
            for (let i = 0; i < webRTC_instance.peers[id].candidateCache.length; i++) {
                sendRTCOverSocket("candidate", webRTC_instance.peers[id].candidateCache[i], id);
            }
        }
    }
    pc.oniceconnectionstatechange = function (event) {
        if (pc.iceConnectionState === "disconnected") {
            delete webRTC_instance.peers[id];
            webRTC_instance.connectionsCount = webRTC_instance.connectionsCount - 1;
            console.log(`[${id}] disconnected! Peers: ${webRTC_instance.connectionsCount}`);
        }
    }
}

function createConnection(id) {
    if (webRTC_instance.peers[id] === undefined) {
        webRTC_instance.peers[id] = {
            candidateCache: []
        };
        const pc = new RTCPeerConnection(webRTC_instance.server/*, options*/);
        initConnection(pc, id, "answer");

        webRTC_instance.peers[id].connection = pc;
        pc.ondatachannel = function (e) {
            webRTC_instance.peers[id].channel = e.channel;
            webRTC_instance.peers[id].channel.owner = id;
            bindEvents(webRTC_instance.peers[id].channel);
        }
    }
}

function bindEvents(channel) {
    channel.onopen = function () {
        webRTC_instance.connectionsCount = webRTC_instance.connectionsCount + 1;
        console.log(`New peer connected! Peers: ${webRTC_instance.connectionsCount}`);
    };

    channel.onmessage = function (e) {
        chatHistory_instance.push(e.data);
    };
}
