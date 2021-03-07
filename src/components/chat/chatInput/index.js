import React, {useEffect, useRef, useState,} from "react";
import './style.css'
import {socket_instance} from "../../../utils/socket";

export default function AutoTextArea() {
    const textAreaRef = useRef(null);
    const [text, setText] = useState("");
    const [textAreaHeight, setTextAreaHeight] = useState("auto");

    /* Automatically increase text area height based on text height */
    useEffect(() => {
        setTextAreaHeight(`${textAreaRef.current.scrollHeight + 2}px`);
    }, [text]);


    const onChangeHandler = function (event) {
        /* need to decrease text area height on text deleting */
        setTextAreaHeight("auto");
        setText(event.target.value);
    };

    const onKeyDown = function (event) {
        /* SHIFT + ENTER = new line, only ENTER send message */
        if (!event.shiftKey && event.keyCode === 13) {
            sendMessage();
            event.preventDefault();
        }
    }

    const sendMessage = function () {
        const msg = text.trim();
        if (msg.length === 0)
            return;

        socket_instance.sendNewMessage(msg);

        /* Sets default text area height */
        setText('');
        setTextAreaHeight("auto");
    }

    return (
        <div className={'AutoTextArea'}>
            <div className={'text-area-container'}>
			<textarea className={'auto-text-area'}
                      ref={textAreaRef}
                      rows={1}
                      style={{
                          height: textAreaHeight,
                          flexGrow: 1,
                      }}
                      value={text}
                      onChange={onChangeHandler}
                      onKeyDown={onKeyDown}
            />
                <button onClick={sendMessage}>
                    <svg id="send-icon" className="send-icon" viewBox="0 0 488.721 488.721">

                        <path d="M483.589,222.024c-5.022-10.369-13.394-18.741-23.762-23.762L73.522,11.331C48.074-0.998,17.451,9.638,5.122,35.086
			C-1.159,48.052-1.687,63.065,3.669,76.44l67.174,167.902L3.669,412.261c-10.463,26.341,2.409,56.177,28.75,66.639
			c5.956,2.366,12.303,3.595,18.712,3.624c7.754,0,15.408-1.75,22.391-5.12l386.304-186.982
			C485.276,278.096,495.915,247.473,483.589,222.024z M58.657,446.633c-8.484,4.107-18.691,0.559-22.798-7.925
			c-2.093-4.322-2.267-9.326-0.481-13.784l65.399-163.516h340.668L58.657,446.633z M100.778,227.275L35.379,63.759
			c-2.722-6.518-1.032-14.045,4.215-18.773c5.079-4.949,12.748-6.11,19.063-2.884l382.788,185.173H100.778z"/>

                    </svg>
                </button>
            </div>
        </div>
    );
};
