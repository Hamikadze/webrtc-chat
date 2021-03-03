import React from 'react';
import './style.css';
import user from "../../ids/user";

export default function Index() {
    let tempUsername = '';
    const handlerOnUsernameInput = function (event){
        tempUsername = event.target.value;
    }

    const handlerOnClick = function (value){
        user.id = tempUsername;
    }

    return <div className={'Login'}>
        <div className={'container'}>
            <label htmlFor="uname"><b>Username</b></label>
            <input type="text" placeholder="Enter Username" onChange={handlerOnUsernameInput} required/>
            <button type="submit" onClick={handlerOnClick}>Login</button>
        </div>
    </div>
}