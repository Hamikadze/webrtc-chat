import {io} from "socket.io-client";
import {webRTC_newPeer, socketReceived} from "./webRTC";
import {user_instance} from "../storage/user";
import {chatHistory_instance} from "../components/chat/chatHistory/store";
import EventListenerClass from "./eventListenerClass";

const ENDPOINT = "https://webrtc-chat-api.herokuapp.com";


class socket extends EventListenerClass {
    constructor() {
        super();
        this._eventListeners = {};
        this.socket = io(ENDPOINT, {
            reconnectionDelayMax: 10000
        });
        this.socket.on("connect", this.onConnect);
        this.socket.on("disconnect", this.onConnect);
    }

    connect({user, room}) {
        if (!this.socket.connected) {
            return;
        }
        this.socket.on("webrtc", socketReceived);
        this.socket.on("webrtc_new_peer", webRTC_newPeer);
        this.socket.on("roomData", this.onRoomData);
        this.socket.on("message", this.onMessage);
        this.socket.on("logged", this.onLogged);
        this.socket.on("error", this.onError);


        // Сразу отправляем запрос на вход в комнату
        this.socket.emit("join", JSON.stringify({username: user, room: room}));
    }

    onConnect = (data) => {
        this._eventListeners['connectionChange']?.forEach(i => {
            i(this.socket.connected);
        });
    }

    onError = (data) =>  {
        this._eventListeners['error']?.forEach(i => {
            i(data);
        });
    }

    onLogged = (data) =>  {
        this._eventListeners['logged']?.forEach(i => {
            i(data);
        });
    }

    onRoomData = (data) =>  {
        this._eventListeners['usersChange']?.forEach(i => {
            i(data.users);
        });
    }

    onBeforeUnload = () =>  {
        this.socket.emit('disconnect');
    }


    onMessage = (data) =>  {
        chatHistory_instance.push(data);
    }

    sendNewMessage = (message) =>  {
        socket_instance.socket.emit("sendMessage", {text: message});
    }

    sendRTCOverSocket = (to, type, message) =>  {
        socket_instance.socket.emit("webrtc", JSON.stringify({id: user_instance.user.id, to: to, type: type, data: message}));
    }
}

export const socket_instance = new socket();