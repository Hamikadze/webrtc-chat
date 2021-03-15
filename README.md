# About webRTC chat

This is a simple JavaScript application – video, audio and text chat room:
* After opening a page, user should enter his name
* After entering the name user should join new chat room
* User can copy link to the room and send to another user to invite him
* User can send text messages to the chat and all users in the chat will see message
* Users can see who sent message to the chat and when
* Users can see who is in the chat room right now

# Getting Started

The deployment is located at: [webRTC chat](https://hamikadze.github.io/webrtc-chat/)

This project uses:
* yarn
* React
* Socket.io client
* gh-pages

webRTC chat is tested on Android and Chromium based browsers.\
webRTC chat not tested on Apple devices (Safari browser) due to lack of them.

## Api server

Api server can be found at: [webRTC chat api](https://github.com/Hamikadze/webrtc-chat-api)

## First things first after cloning a repository

Run in the project directory `yarn`

## Available Scripts

In the project directory, you can run:

### `yarn run start`

Runs the app in the development mode.\
Open [http://localhost:3000/](http://localhost:3000/) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn run build`

Builds the app for production to the `build` folder.

To use it, you need to replace
`"homepage": "http://Hamikadze.github.io/webrtc-chat/"` with
`"homepage": "."` in *package.json*

### `yarn run deploy`

Creates a build that assumes your app will be hosted at the root of the server.

To use it, you need to replace
`"homepage": "http://Hamikadze.github.io/webrtc-chat/"` with
`"homepage": "http://{username}.github.io/{repo-name}"` in *package.json*
