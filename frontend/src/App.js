import React, { Component } from 'react';
// FontAwesome imports
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle, faBell } from '@fortawesome/free-solid-svg-icons'
// Developer Externals
import './App.min.css';
import {
    notify, createServer, confirmServer, leaveServer, loadVideo, updateVideo,
    confirmUpdateVideo, confirmVideo
} from './socket';
// React Player
import ReactPlayer from 'react-player'

library.add(faExclamationCircle);
library.add(faBell);

const VERSION = "0.2.5";

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
            <div className="notification-panel-wrapper">
                <div className="notification-panel">
                    <strong>Notification</strong>&nbsp; {this.state.notification}
                </div>
            </div>
        );
    }
}

class ServerOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            errorMsg: ""
        };
    }

    onCreateServer() {
        let serverName = document.getElementById("servername").value;
        let serverPass = document.getElementById("serverpassword").value;

        if (serverName !== "")
            createServer({serverName: serverName, serverPass: serverPass});
        else
            this.setState({error: true, errorMsg: "*You can not have a blank server name!"});
    }

    render() {
        let errorMsg = null;
        if (this.state.error)
            errorMsg = <div className="error-msg">{this.state.errorMsg}</div>

        return (
            <div className="server-options-panel">
                <div className="warning">
                    <FontAwesomeIcon icon="exclamation-circle" />&nbsp;
                    Warning! The password is not encrypted and is just a
                    temporary passphrase to prevent random joins.
                </div>
                {errorMsg}
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

class Footer extends Component {
    render() {
        return(
            <footer>
                <div className="footer-content">
                    <p className="text-title">
                        About This Project
                    </p>
                    <p className="text-paragraph">
                        This project allows you as the user to create a room where
                        you can invite your friends to join to watch a video together.
                        This room allows you to sync the videos using a button so
                        everyone can watch the video at the same time.
                    </p>
                    <p className="text-paragraph">
                        This project will be worked on to expanded to include other
                        functionality such as,
                        <ul>
                            <li>Room leader as an option!</li>
                            <li>Option to allow the room to sync pausing and playing</li>
                            <li>Integrate a chat room</li>
                        </ul>
                        <strong>Current Version: {VERSION} Copyright &copy; 2019</strong>
                    </p>
                </div>
                <div className="footer-footer">
                    <div>Icons made by <a href="https://www.flaticon.com/authors/itim2101" title="itim2101">itim2101</a>, <a href="https://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank" rel="noopener noreferrer">CC 3.0 BY</a></div>
                </div>
            </footer>
        );
    }
}

class Header extends Component {
    render() {
        return(
            <header>
                JARP REACT COMMUNITY VIDEO PLAYER
            </header>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "serverID" : "",
            "videoURL" : "",
            "playing" : true,
            "width" : "1280px",
            "height" : "720px",
        };
        this.videoPlayer = React.createRef();

        confirmServer((serverID) => {this.setState({ "serverID" : serverID});});
        confirmVideo((videoURL) => {this.setState({ "videoURL" : videoURL});});
        confirmUpdateVideo((data) => {
            this.videoPlayer.current.seekTo(data.videoSeconds/data.videoDuration);
            this.setState({"playing" : "true"});
        });
    }

    setVideoURL() {
        // Set a request to the server to update the video.
        let videoURL = document.getElementById("videoURL").value;
        loadVideo(videoURL);
    }

    onLeaveServer() {
        leaveServer();
        this.setState({"serverID" : "", "videoURL" : ""});
    }

    onForceUpdate() {
        let videoSeconds = this.videoPlayer.current.getCurrentTime();
        let videoDuration = this.videoPlayer.current.getDuration();
        updateVideo({videoSeconds: videoSeconds, videoDuration:videoDuration});
    }

    handleEnterKey(event) {
        if(event.key === "Enter")
            this.setVideoURL();
    }

    componentDidUpdate(prevProps, prevState){
        // Once the components updates so that we are able to include the video
        // player and its wrapper. We can then dynamically calculate the size
        // of the wrapper and reshape it to fix the user's window.
        let serverPanelDiv = document.getElementById("server-panel");

        // Check if the wrapper exists
        if (serverPanelDiv != null) {
            let serverPanelStyle = window.getComputedStyle(serverPanelDiv, null);
            // The getPropertyValue returns the width in "(number)px" use parseInt
            // to extract the numeric value.
            let videoWidth = parseInt(serverPanelStyle.getPropertyValue("width"));
            if (prevState.width !== videoWidth){
                let videoHeight = videoWidth * (9/16);
                this.setState({
                    "width" : videoWidth,
                    "height" : videoHeight,
                });
            }
        }
    }

    render() {
        const SEPARATOR = " ";
        let serverPanel = null;

        if (this.state.serverID !== "") {
            document.addEventListener("keydown", this.handleEnterKey.bind(this), false);
            serverPanel =
            <div id="server-panel" className="server-panel">
                <div className="server-url">
                    Video URL
                    {SEPARATOR}
                    <input id="videoURL" type="text" name="videoURL"/>
                    {SEPARATOR}
                    <button className="solid" onClick={this.setVideoURL.bind(this)}>
                        Load Video URL
                    </button>
                </div>
                <ReactPlayer
                    ref={this.videoPlayer}
                    className="video-wrapper"
                    url={this.state.videoURL}
                    width={this.state.width}
                    height={this.state.height}
                    controls={true}
                    playing={this.state.playing}
                />
                <div className="video-controls">
                    <div className="seek-bar">
                    </div>
                </div>
                <button className="solid" onClick={this.onForceUpdate.bind(this)}>
                    Force Update
                </button>
                {SEPARATOR}
                <button className="solid" onClick={this.onLeaveServer.bind(this)}>
                    Leave Server
                </button>
            </div>;
        } else {
            document.removeEventListener("keydown", this.handleEnterKey.bind(this), false);
            serverPanel = <ServerOptions />;
        }

        return (
            <div>
                <Header />
                <Notification />
                {serverPanel}
                <Footer />
            </div>
        );
    }
}

export default App;
