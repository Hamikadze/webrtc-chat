# Getting Started

The deployment is located at: [webRTC chat](https://hamikadze.github.io/webrtc-chat/)

This project uses:
* yarn
* React
* Socket.io client
* gh-pages

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