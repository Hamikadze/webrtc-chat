import React, {useEffect, useState} from 'react';
import './style.css';
import {chatHistory_instance} from "./store";

export default function ChatHistory() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        chatHistory_instance.addEventListener('newMessage', onMessage);
        return () => {
            chatHistory_instance.removeEventListener('newMessage', onMessage);
        };
    }, []);
    const onMessage = (event) => {
        console.log(event);
        setMessages(v => [...v, event]);
    }
    return <div className={'ChatHistory'}>
        <div className={'container'}>
            <div className={"chat-log"}>
                {messages.map(value =>
                    <>
                        <div className={'container'}>

                            <div className={'user'}>{`${value.id}`}</div>
                            <div className={'time'}>
                                {`${('0' + value.time.getHours()).substr(-2)}:${('0' + value.time.getMinutes()).substr(-2)}`}
                            </div>
                        </div>
                        <span className={'message'}>{`${value.data}`}</span>
                    </>
                )}

            </div>
        </div>
    </div>
}