import React, {useEffect, useState} from 'react';
import './style.css';
import {chat_instance} from "../../../storage/chat";

export default function ChatHistory() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        chat_instance.addEventListener('newMessage', onMessage);
        return () => {
            chat_instance.removeEventListener('newMessage', onMessage);
        };
    }, []);
    const onMessage = (event) => {
        setMessages(v => [...v, event]);
    }

    const formatTime = (time) => `${('0' + time.getHours()).substr(-2)}:${('0' + time.getMinutes()).substr(-2)}`

    return <div className={'ChatHistory'}>
        <div className={'chat-history-container'}>
            {messages.map((data, i) =>
                <div key={i}>
                    <div className={'info-container'}>

                        <div className={'user'}>{`${data.user}`}</div>
                        <div className={'time'}>
                            {formatTime(data.data.time)}
                        </div>
                    </div>
                    <span style={{whiteSpace: 'pre-line'}} className={'message'}>{`${data.data.text}`}</span>
                </div>
            )}
        </div>
    </div>
}