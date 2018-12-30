import React, { Component } from 'react';
// FontAwesome imports
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
// Developer Externals
import './App.min.css';
import {
    notify, createServer, confirmServer, leaveServer, loadVideo, updateVideo,
    confirmUpdateVideo, confirmVideo
} from './socket';
// React Player
import ReactPlayer from 'react-player'

library.add(faExclamationCircle);

class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = { notification : "" };
        notify((message) => {
            this.setState({notification : message});
        });
    }

    render() {
        return (
            <div className="notification-panel">
                <strong>NOTIFICATION</strong> {this.state.notification}
            </div>
        );
    }
}

class ServerOptions extends Component {
    onCreateServer() {
        let serverName = document.getElementById("servername").value;
        let serverPass = document.getElementById("serverpassword").value;
        createServer({serverName: serverName, serverPass: serverPass});
    }

    render() {
        return (
            <div className="server-options-panel">
                <div className="warning">
                    <FontAwesomeIcon icon="exclamation-circle" />&nbsp;
                    Warning! The password is not encrypted and is just a
                    temporary passphrase to prevent random joins.
                </div>
                <div className="input-area">
                    <div className="input-row">
                        <label for="servername">Server Name</label>
                        <input id="servername" type="text" name="servername"/>
                    </div>
                    <div className="input-row">
                        <label for="serverpassword">Server Password</label>
                        <input id="serverpassword" type="text" name="serverpassword"/>
                    </div>
                </div>
                <div>
                    <button className="solid" onClick={this.onCreateServer.bind(this)}>
                        Create / Join Server
                    </button>
                </div>
            </div>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "serverID" : "",
            "videoURL" : "",
            "playing" : "true"
        };
        this.videoPlayer = React.createRef();

        confirmServer((serverID) => {this.setState({ "serverID" : serverID});});
        confirmVideo((videoURL) => {this.setState({ "videoURL" : videoURL});});
        confirmUpdateVideo((data) => {
            this.videoPlayer.current.seekTo(data.videoSeconds/data.videoDuration);
            this.setState({"playing" : "true"});
        });
    }

    setVideoURL(){
        // Set a request to the server to update the video.
        let videoURL = document.getElementById("videoURL").value;
        loadVideo(videoURL);
    }

    onLeaveServer() {
        leaveServer();
        this.setState({"serverID" : ""});
    }

    onForceUpdate() {
        let videoSeconds = this.videoPlayer.current.getCurrentTime();
        let videoDuration = this.videoPlayer.current.getDuration();
        updateVideo({videoSeconds: videoSeconds, videoDuration:videoDuration});
    }

    render() {
        let serverPanel = null;

        if (this.state.serverID !== "") {
            serverPanel =
            <div className="server-panel">
                <div className="server-id">Connected ServerID: {this.state.serverID}</div>
                <div className="server-url">
                    Video URL:
                    &nbsp;
                    <input id="videoURL" type="text" name="videoURL"/>
                    &nbsp;
                    <button className="solid" onClick={this.setVideoURL.bind(this)}>
                        Load Video URL
                    </button>
                </div>
                <ReactPlayer
                    ref={this.videoPlayer}
                    className="video-wrapper"
                    url={this.state.videoURL}
                    width="1280px"
                    height="720px"
                    controls="true"
                    playing={this.state.playing}
                />
                <div className="video-controls">
                    <div className="seek-bar">
                    </div>
                </div>
                <button className="solid" onClick={this.onForceUpdate.bind(this)}>
                    Force Update
                </button>
                &nbsp;
                <button className="solid" onClick={this.onLeaveServer.bind(this)}>
                    Leave Server
                </button>
            </div>;
        } else {
            serverPanel = <ServerOptions />;
        }

        return (
            <div>
                <Notification />
                {serverPanel}
            </div>
        );
    }
}

export default App;
