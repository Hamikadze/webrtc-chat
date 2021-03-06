(this["webpackJsonpwebrtc-chat"]=this["webpackJsonpwebrtc-chat"]||[]).push([[0],{46:function(e,t,n){},47:function(e,t,n){},80:function(e,t,n){},82:function(e,t,n){},83:function(e,t,n){},84:function(e,t,n){},85:function(e,t,n){},86:function(e,t,n){},87:function(e,t,n){},88:function(e,t,n){},89:function(e,t,n){"use strict";n.r(t);var c=n(1),r=n.n(c),o=n(40),s=n.n(o),a=(n(46),n(2)),i=(n(47),n(3)),u=n.n(i),l=n(11),d=n(4),f=n(5),h=n(15),v=n(14),j=n(41),b=new(function(){function e(){Object(d.a)(this,e),this._eventListeners={},this._user={id:"",name:"",room:this.roomId},this._localStream=null}return Object(f.a)(e,[{key:"localStream",get:function(){return this._localStream},set:function(e){this._localStream=e}},{key:"user",get:function(){return this._user},set:function(e){this._user=e}},{key:"roomId",get:function(){var e=window.location.pathname.substr(1);return e||(e=function(){var e=function(){return Math.floor(65536*Math.random()).toString(16)};return"".concat(e()).concat(e(),"-").concat(e(),"-").concat(e(),"-").concat(e(),"-").concat(e()).concat(e()).concat(e())}(),window.location=e),e}}]),e}()),m=function(){function e(){Object(d.a)(this,e),this._eventListeners={}}return Object(f.a)(e,[{key:"addEventListener",value:function(e,t){void 0===this._eventListeners[e]&&(this._eventListeners[e]=[]),this._eventListeners[e].push(t)}},{key:"removeEventListener",value:function(e,t){this._eventListeners[e]=this._eventListeners[e].filter((function(e){return e.toString()!==t.toString()}))}}]),e}(),O=new(function(e){Object(h.a)(n,e);var t=Object(v.a)(n);function n(){var e;return Object(d.a)(this,n),(e=t.call(this))._eventListeners={},e._log=[],e}return Object(f.a)(n,[{key:"log",get:function(){return this._log}},{key:"push",value:function(e){var t,n,c=this;e.data.time=new Date(e.data.time),this._log.push(e),null===(t=this._eventListeners.newMessage)||void 0===t||t.forEach((function(t){return t(e)})),null===(n=this._eventListeners.newMessages)||void 0===n||n.forEach((function(e){return e(c._log)}))}}]),n}(m)),p=new(function(e){Object(h.a)(n,e);var t=Object(v.a)(n);function n(){var e;return Object(d.a)(this,n),(e=t.call(this)).onConnect=function(t){var n;null===(n=e._eventListeners.connectionChange)||void 0===n||n.forEach((function(t){t(e.socket.connected)}))},e.onError=function(t){var n;null===(n=e._eventListeners.error)||void 0===n||n.forEach((function(e){e(t)}))},e.onLogged=function(t){var n;null===(n=e._eventListeners.logged)||void 0===n||n.forEach((function(e){e(t)}))},e.onRoomData=function(t){var n;null===(n=e._eventListeners.usersChange)||void 0===n||n.forEach((function(e){e(t.users)}))},e.onBeforeUnload=function(){e.socket.emit("disconnect")},e.onMessage=function(e){O.push(e)},e.sendNewMessage=function(e){p.socket.emit("sendMessage",{text:e})},e.sendRTCOverSocket=function(e,t,n){p.socket.emit("webrtc",JSON.stringify({id:b.user.id,to:e,type:t,data:n}))},e._eventListeners={},e.socket=Object(j.io)("https://webrtc-chat-api.herokuapp.com",{reconnectionDelayMax:1e4}),e.socket.on("connect",e.onConnect),e.socket.on("disconnect",e.onConnect),e}return Object(f.a)(n,[{key:"connect",value:function(e){var t=e.user,n=e.room;this.socket.connected&&(this.socket.on("webrtc",w),this.socket.on("webrtc_new_peer",x),this.socket.on("roomData",this.onRoomData),this.socket.on("message",this.onMessage),this.socket.on("logged",this.onLogged),this.socket.on("error",this.onError),this.socket.emit("join",JSON.stringify({username:t,room:n})))}}]),n}(m)),g=new(function(e){Object(h.a)(n,e);var t=Object(v.a)(n);function n(){var e;return Object(d.a)(this,n),(e=t.call(this)).onBeforeUnload=function(){for(var e in g.peers)if(g.peers.hasOwnProperty(e)&&void 0!==g.peers[e].channel)try{g.peers[e].channel.close()}catch(t){console.error(t)}},e._streams={},e._eventListeners={},e._connectionsCount=0,e.peers={},e.server={iceServers:[{url:"turn:217.150.77.131:3478",username:"turnclient",credential:"$0mep@$$w0rd"},{url:"stun:217.150.77.131:3478"},{url:"stun:stun.l.google.com:19302"},{url:"stun:stun1.l.google.com:19302"},{url:"stun:stun2.l.google.com:19302"},{url:"stun:stun3.l.google.com:19302"},{url:"stun:stun4.l.google.com:19302"}]},console.log("webRTC created!"),e}return Object(f.a)(n,[{key:"connectionsCount",get:function(){return this._connectionsCount},set:function(e){var t,n=this;this._connectionsCount=e,null===(t=this._eventListeners.connectionsChange)||void 0===t||t.forEach((function(e){e({count:n._connectionsCount,peers:n.peers.keys})}))}},{key:"addStream",value:function(e,t){var n,c=this;this._streams[e]=t,null===(n=this._eventListeners["streamAdded-".concat(e)])||void 0===n||n.forEach((function(t){void 0!==c._streams[e]&&t(c._streams[e])}))}},{key:"getStream",value:function(e){return this._streams[e]}}]),n}(m));function x(e){return k.apply(this,arguments)}function k(){return(k=Object(l.a)(u.a.mark((function e(t){var n,c,r;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=t.user,c=t.data,"SERVER"===n){e.next=3;break}return e.abrupt("return");case 3:return console.log("Creating new peer",[n,c]),_(c.id),r=g.peers[c.id].connection,e.next=8,S(c.id,r);case 8:return e.next=10,r.createOffer().then((function(e){return r.setLocalDescription(e).catch((function(e){return console.error("Error set local description",e)}))})).catch((function(e){return console.error("Error create offer",e)}));case 10:L(c.id,"offer",r);case 11:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function w(e){var t=JSON.parse(e);switch(console.log("socketReceived:",t),t.type){case"candidate":!function(e,t){y.apply(this,arguments)}(t.id,t.data);break;case"offer":!function(e,t){E.apply(this,arguments)}(t.id,t.data);break;case"answer":!function(e,t){C.apply(this,arguments)}(t.id,t.data);break;default:console.log("Unknown type received from socket:"),console.log(t)}}function C(){return(C=Object(l.a)(u.a.mark((function e(t,n){var c;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("Remote answer received",[t,n]),c=g.peers[t].connection,e.next=4,c.setRemoteDescription(n).catch((function(e){return console.error("Error set remote description",e)}));case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function y(){return(y=Object(l.a)(u.a.mark((function e(t,n){var c;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("Remote offer received",[t,n]),_(t),c=g.peers[t].connection,e.next=5,c.addIceCandidate(n).catch((function(e){return console.error("Error add iceCandidate",e)}));case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function E(){return(E=Object(l.a)(u.a.mark((function e(t,n){var c;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("Remote offer received",[t,n]),_(t),c=g.peers[t].connection,e.next=5,S(t,c);case 5:return e.next=7,c.setRemoteDescription(n).then((function(){c.createAnswer().then((function(e){return c.setLocalDescription(e).catch((function(e){return console.error("Error set local description",e)}))})).catch((function(e){return console.error("Error create answer",e)}))})).catch((function(e){return console.error("Error set remote description",e)}));case 7:L(t,"answer",c);case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function L(e,t,n){n.onicecandidate=function(c){if(c.candidate)g.peers[e].candidateCache.push(c.candidate);else{p.sendRTCOverSocket(e,t,n.localDescription);for(var r=0;r<g.peers[e].candidateCache.length;r++)p.sendRTCOverSocket(e,"candidate",g.peers[e].candidateCache[r])}},n.oniceconnectionstatechange=function(t){switch(n.iceConnectionState){case"disconnected":delete g.peers[e],g.connectionsCount=g.connectionsCount-1,console.log("[".concat(e,"] disconnected! Peers: ").concat(g.connectionsCount));break;case"connected":g.connectionsCount=g.connectionsCount+1,console.log("[".concat(e,"] connected! Peers: ").concat(g.connectionsCount));break;default:console.log(n.iceConnectionState)}},n.onnegotiationneeded=function(){var c=Object(l.a)(u.a.mark((function c(r){return u.a.wrap((function(c){for(;;)switch(c.prev=c.next){case 0:if("stable"===n.signalingState){c.next=2;break}return c.abrupt("return");case 2:n.createOffer().then((function(c){n.setLocalDescription(c).then((function(){p.sendRTCOverSocket(e,t,n.localDescription)})).catch((function(e){return console.error("Error set local description",e)}))})).catch((function(e){return console.error("Error create offer",e)}));case 3:case"end":return c.stop()}}),c)})));return function(e){return c.apply(this,arguments)}}()}function S(e,t){return N.apply(this,arguments)}function N(){return(N=Object(l.a)(u.a.mark((function e(t,n){var c;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n.ontrack=function(e){var n=Object(a.a)(e.streams,1)[0];g.addStream(t,n)},(c=document.getElementById("video-".concat(b.user.id)))&&(c.srcObject=b.localStream),b.localStream.getTracks().forEach((function(e){n.addTrack(e,b.localStream)}));case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function _(e){void 0===g.peers[e]&&(g.peers[e]={candidateCache:[]},g.peers[e].connection=new RTCPeerConnection)}n(80);var D=n(0);function R(){var e=Object(c.useState)(""),t=Object(a.a)(e,2),n=t[0],r=t[1],o=Object(c.useState)(""),s=Object(a.a)(o,2),i=s[0],u=s[1],l=Object(c.useState)(""),d=Object(a.a)(l,2),f=d[0],h=d[1];Object(c.useEffect)((function(){return p.addEventListener("error",v),p.addEventListener("connectionChange",j),function(){p.removeEventListener("error",v),p.removeEventListener("connectionChange",j)}}),[]);var v=function(e){switch(e.type){case"addUser":u(e.error)}},j=function(e){h(e)},m=function(e){p.connect({user:n,room:b.user.room})};return Object(D.jsx)("div",{className:"Login",children:Object(D.jsxs)("div",{className:"login-container",children:[Object(D.jsxs)("div",{className:"login-info-container",children:[Object(D.jsx)("label",{htmlFor:"uname",children:Object(D.jsx)("b",{children:"Username"})}),Object(D.jsx)("label",{className:"info-connected",style:{color:f?"#B1D9CD":"#FDB196"},children:Object(D.jsx)("b",{children:f?"Connected":"Disconnected"})})]}),Object(D.jsx)("input",{type:"text",placeholder:"Enter Username",onChange:function(e){r(e.target.value)},onKeyDown:function(e){13===e.keyCode&&m()},required:!0}),Object(D.jsx)("div",{className:"login-error",children:i}),Object(D.jsx)("button",{type:"submit",onClick:m,children:"Login"})]})})}var B=n(21);n(82);function M(){var e=Object(c.useState)([]),t=Object(a.a)(e,2),n=t[0],r=t[1];Object(c.useEffect)((function(){return p.addEventListener("usersChange",o),function(){p.removeEventListener("usersChange",o)}}),[]);var o=function(e){r(Object(B.a)(e))};return Object(D.jsx)("div",{className:"UsersList",children:Object(D.jsx)("div",{className:"users-list-container",children:Object(D.jsx)("ol",{className:"users-list",children:n.map((function(e){return Object(D.jsxs)("li",{className:"list-item",children:[Object(D.jsx)("div",{className:"user-item-gradient"}),Object(D.jsx)("div",{className:"user-item-content",children:Object(D.jsx)("h4",{children:"".concat(e.name)})})]},e.id)}))})})})}n(83),n(84);function T(e){var t=e.videoId,n=e.title,r=e.type,o=e.onClick,s=Object(c.useRef)(null);Object(c.useEffect)((function(){return g.addEventListener("streamAdded-".concat(t),a),null!==s&&(s.current.srcObject=g.getStream(t)),function(){g.addEventListener("streamAdded-".concat(t),a)}}),[]);var a=function(e){null!==s&&(s.current.srcObject=e)};return Object(D.jsxs)("article",{className:"video-listing",children:[Object(D.jsx)("div",{onClick:function(e){o(e)},id:"title-".concat(t),className:"video-title",children:n}),Object(D.jsx)("div",{className:"video-container",children:Object(D.jsx)("video",{ref:s,autoPlay:!0,muted:"local"===r,className:"".concat(r,"-video"),id:"video-".concat(t)})})]},"article-".concat(t))}var U=n.p+"static/media/camera.53281603.svg",F=n.p+"static/media/microphone.b5ad8492.svg";n(85);function I(){var e=Object(c.useState)(b.localStream.getVideoTracks()[0].enabled),t=Object(a.a)(e,2),n=t[0],r=t[1],o=Object(c.useState)(b.localStream.getVideoTracks()[0].enabled),s=Object(a.a)(o,2),i=s[0],u=s[1],l=b.localStream.getVideoTracks()[0],d=b.localStream.getAudioTracks()[0];return Object(D.jsx)("div",{className:"StreamControls",children:Object(D.jsxs)("div",{className:"controls-container",children:[Object(D.jsx)("div",{style:{backgroundColor:n?"#B1D9CD":"#FDB196"},className:"round-container",onClick:function(){l.enabled=!l.enabled,r(l.enabled)},children:Object(D.jsx)("img",{src:U,alt:"camera icon"})}),Object(D.jsx)("div",{style:{backgroundColor:i?"#B1D9CD":"#FDB196"},className:"round-container",onClick:function(){d.enabled=!d.enabled,u(d.enabled)},children:Object(D.jsx)("img",{src:F,alt:"microphone icon"})})]})})}function A(){var e=Object(c.useState)([]),t=Object(a.a)(e,2),n=t[0],r=t[1],o=Object(c.useRef)(null);Object(c.useEffect)((function(){return p.addEventListener("usersChange",s),function(){p.removeEventListener("usersChange",s)}}),[]);var s=function(e){r(e)},i=function(e){o.current.srcObject=document.getElementById("video-".concat(e.target.id.substr(6))).srcObject};return Object(D.jsxs)("div",{className:"VideoGrid",children:[Object(D.jsxs)("div",{className:"video-row-container",children:[Object(D.jsx)(T,{title:b.user.name,videoId:b.user.id,onClick:i,type:"local"}),n.filter((function(e){return e.id!==b.user.id})).map((function(e){return Object(D.jsx)(T,{title:e.name,videoId:e.id,onClick:i,type:"remote"})}))]}),Object(D.jsx)("div",{className:"selected-video-container",children:Object(D.jsx)("video",{ref:o,autoPlay:!0,muted:!0,className:"selected-video",id:"selected-video"})}),Object(D.jsx)("div",{className:"stream-controls-container",children:Object(D.jsx)(I,{})})]})}n(86),n(87);function P(){var e=Object(c.useState)([]),t=Object(a.a)(e,2),n=t[0],r=t[1];Object(c.useEffect)((function(){return O.addEventListener("newMessage",o),function(){O.removeEventListener("newMessage",o)}}),[]);var o=function(e){r((function(t){return[].concat(Object(B.a)(t),[e])}))};return Object(D.jsx)("div",{className:"ChatHistory",children:Object(D.jsx)("div",{className:"chat-history-container",children:n.map((function(e,t){return Object(D.jsxs)("div",{children:[Object(D.jsxs)("div",{className:"info-container",children:[Object(D.jsx)("div",{className:"user",children:"".concat(e.user)}),Object(D.jsx)("div",{className:"time",children:(n=e.data.time,"".concat(("0"+n.getHours()).substr(-2),":").concat(("0"+n.getMinutes()).substr(-2)))})]}),Object(D.jsx)("span",{style:{whiteSpace:"pre-line"},className:"message",children:"".concat(e.data.text)})]},t);var n}))})})}n(88);function J(){var e=Object(c.useRef)(null),t=Object(c.useState)(""),n=Object(a.a)(t,2),r=n[0],o=n[1],s=Object(c.useState)("auto"),i=Object(a.a)(s,2),u=i[0],l=i[1];Object(c.useEffect)((function(){l("".concat(e.current.scrollHeight+2,"px"))}),[r]);var d=function(){var e=r.trim();0!==e.length&&(p.sendNewMessage(e),o(""),l("auto"))};return Object(D.jsx)("div",{className:"AutoTextArea",children:Object(D.jsxs)("div",{className:"text-area-container",children:[Object(D.jsx)("textarea",{className:"auto-text-area",ref:e,rows:1,style:{height:u,flexGrow:1},value:r,onChange:function(e){l("auto"),o(e.target.value),console.log(r.split("\r\n"))},onKeyDown:function(e){e.shiftKey||13!==e.keyCode||(d(),e.preventDefault())}}),Object(D.jsx)("button",{onClick:d,children:"Send"})]})})}function V(){return Object(D.jsxs)("div",{className:"Chat",children:[Object(D.jsx)(P,{}),Object(D.jsx)(J,{})]})}var H=function(){var e=Object(c.useState)(!1),t=Object(a.a)(e,2),n=t[0],r=t[1],o=function(e){b.user=e.data,r(!0)};return Object(c.useEffect)((function(){if(navigator.mediaDevices.getUserMedia({video:!0,audio:!0}).then((function(e){return b.localStream=e})).catch((function(e){return console.error("Error get user media",e)})),p.addEventListener("logged",o),n)return window.addEventListener("beforeunload",p.onBeforeUnload),window.addEventListener("beforeunload",g.onBeforeUnload),function(){p.removeEventListener("logged",o),window.removeEventListener("beforeunload",g.onBeforeUnload),window.removeEventListener("beforeunload",p.onBeforeUnload)}}),[n]),Object(D.jsxs)("div",{className:"App",children:[" ",n?Object(D.jsx)(D.Fragment,{children:Object(D.jsx)(D.Fragment,{children:Object(D.jsxs)("div",{className:"App-body",children:[Object(D.jsx)("div",{className:"video-grid-container",children:Object(D.jsx)(A,{})}),Object(D.jsxs)("div",{className:"info-chat-container",children:[Object(D.jsx)(M,{}),Object(D.jsx)(V,{})]})]})})}):Object(D.jsx)(R,{})]})},K=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,90)).then((function(t){var n=t.getCLS,c=t.getFID,r=t.getFCP,o=t.getLCP,s=t.getTTFB;n(e),c(e),r(e),o(e),s(e)}))};s.a.render(Object(D.jsx)(r.a.StrictMode,{children:Object(D.jsx)(H,{})}),document.getElementById("root")),K()}},[[89,1,2]]]);
//# sourceMappingURL=main.c1e039c3.chunk.js.map