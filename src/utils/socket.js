import {io} from "socket.io-client";
import {user_instance} from "../storage/user";
import {chat_instance} from "../storage/chat";
import EventListenerClass from "./eventListenerClass";
import {webRTC_instance} from "./webRTC";

//automatic endpoint selection based on environment variables type
const ENDPOINT = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ?
    'http://localhost:4001' : 'https://webrtc-chat-api.herokuapp.com/';

class socket extends EventListenerClass {
    constructor() {
        super();
        this.socket = io(ENDPOINT, {
            reconnectionDelayMax: 10000
        });
        /* Tracks connection to the socket by connected state */
        this.socket.on("connect", this.onConnect);
        this.socket.on("disconnect", this.onConnect);
    }

    connect({user, room}) {
        if (!this.socket.connected) {
            return;
        }

        /* Subscribe to events from socket */
        this.socket.on("webrtc", webRTC_instance.socketReceived);
        this.socket.on("webrtc_new_peer", webRTC_instance.webrtcNewPeer);
        this.socket.on("roomData", this.onRoomData);
        this.socket.on("message", this.onMessage);
        this.socket.on("logged", this.onLogged);
        this.socket.on("error", this.onError);

        /* sending to socket server room join request */
        this.socket.emit("join", JSON.stringify({username: user, room: room}));
    }

    /* when connected or disconnected from socket calls all methods to handle events */
    onConnect = (data) => {
        this._eventListeners['connectionChange']?.forEach(i => {
            i(this.socket.connected);
        });
    }

    /* when error if arrived from socket calls all methods to handle events */
    onError = (data) =>  {
        this._eventListeners['error']?.forEach(i => {
            i(data);
        });
    }

    /* when successfully logged to socket calls all methods to handle events */
    onLogged = (data) =>  {
        this._eventListeners['logged']?.forEach(i => {
            i(data);
        });
    }

    /* when new user connected or disconnected to socket calls all methods to handle events */
    onRoomData = (data) =>  {
        this._eventListeners['usersChange']?.forEach(i => {
            i(data.users);
        });
    }

    /* before unloaded send to socket disconnect message */
    onBeforeUnload = () =>  {
        this.socket.emit('disconnect');
    }

    /* add new message to chat history */
    onMessage = (data) =>  {
        chat_instance.push(data);
    }

    /* send new text message to socket (it will be sent to other users in the room)*/
    sendNewMessage = (message) =>  {
        socket_instance.socket.emit("sendMessage", {text: message});
    }

    /*
    * send new message to socket,
    * contains info to establish connections between peers via webRTC
    * like offer, answer, candidate (iceCandidate)
    */
    sendRTCOverSocket = (to, type, message) =>  {
        socket_instance.socket.emit("webrtc", {id: user_instance.user.id, to: to, type: type, data: message});
    }
}

export const socket_instance = new socket();