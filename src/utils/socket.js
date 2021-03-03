import {io} from "socket.io-client";
import {
    socketNewPeer,
    socketReceived
} from "./webRTC";
import user from "../ids/user";
import room from "../ids/room";
import {chatHistory_instance} from "../components/chat/chatHistory/store";
import {userList_instance} from "../components/usersList/store";

const ENDPOINT = "http://10.0.0.195:4001";


class socket {
    constructor() {
        // Указываем, что при закрытии сообщения нужно отправить серверу оповещение об этом

        this.socket = io(ENDPOINT, {
            reconnectionDelayMax: 10000
        });
        this.socket.on("webrtc", socketReceived);
        this.socket.on("new", socketNewPeer);
        this.socket.on("message", socketMessage);
        this.socket.on("users", usersChange);

        // Сразу отправляем запрос на вход в комнату
        this.socket.emit("room", JSON.stringify({id: user.id, room: room.id}));
    }
}

export const socket_instance = new socket();

function usersChange(data) {
    const json = JSON.parse(data);
    userList_instance.users = json;
}

function socketMessage(data) {
    const json = JSON.parse(data);
    chatHistory_instance.push(json);
}

// Вспомогательная функция для отправки адресных сообщений, связанных с WebRTC
export function sendRTCOverSocket(type, message, to) {
    socket_instance.socket.emit("webrtc", JSON.stringify({id: user.id, to: to, type: type, data: message}));
}

export function sendNewMessage(message){
    socket_instance.socket.emit("message", JSON.stringify({id: user.id, data: message}));

}