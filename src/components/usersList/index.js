import React from 'react';
import './style.css';

export default function UserList() {


    return <div className={'Login'}>
        <div className={'container'}>
            <label htmlFor="uname"><b>Username</b></label>
            <input type="text" placeholder="Enter Username" onChange={handlerOnUsernameInput} required/>
            <button type="submit" onClick={handlerOnClick}>Login</button>
        </div>
    </div>
}