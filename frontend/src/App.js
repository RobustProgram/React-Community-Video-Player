import React, { Component } from 'react';

// Developer Externals
import './App.min.css';
import {
    notify, confirmServer, leaveServer, loadVideo, updateVideo,
    confirmUpdateVideo, confirmVideo
} from './socket';

import Header from './components/Header';
import GitHubStrip from './components/GitHubStrip';
import ServerOptions from './components/ServerOptions';
import Footer from './components/Footer';
import ChatRoom from './components/ChatRoom';

// React Player
import ReactPlayer from 'react-player'

// FontAwesome imports
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExclamationCircle, faBell, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { faGithubSquare } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// React Transition
import { CSSTransition } from 'react-transition-group';

library.add(faExclamationCircle, faBell, faPlus, faMinus, faGithubSquare);

class Notification extends Component {
    constructor(props) {
        super(props);

        let initial_notifications = JSON.parse(localStorage.getItem('notifications'));
        if (initial_notifications == null)
            this.state = { notification : [] };
        else
            this.state = { notification : initial_notifications };

        notify((message) => {
            // Received the message from the server
            let notifications = this.state.notification;
            notifications.push(message);
            this.setState({notification:notifications});
        });
    }

    componentWillUnmount() {
        // Store the notification in memory
        localStorage.setItem('notifications', JSON.stringify(this.state.notification));
    }

    render() {
        let notifyContent = [];
        for(let item in this.state.notification)
            notifyContent.push(<div key={item}>{this.state.notification[item]}</div>);
        return(
            <div className="notify-content">
                {notifyContent}
            </div>
        );
    }
}

const NOTIFICATION_PANEL = 0;
const CHAT_PANEL = 1;

class BottomPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            whatPanel: NOTIFICATION_PANEL,
            expanded: true,
        }
    }

    switchToPanel(type) { this.setState({whatPanel:type}); }
    expandPanel(){ this.setState({expanded: !this.state.expanded}); }

    render() {
        // We are assuming the default state of, being expanded & is looking at
        // the notification.
        let currentIcon = <FontAwesomeIcon icon="minus"/>;
        let currentPanel = <Notification />;

        if (this.state.whatPanel === CHAT_PANEL)
            currentPanel = <ChatRoom />;

        if (!this.state.expanded)
            currentIcon = <FontAwesomeIcon icon="plus"/>;

        return(
            <div className="bottom-panel">
                <div className="close-wrapper">
                    <button
                        onClick={this.expandPanel.bind(this)}
                        className="bottom-panel-close">
                        {currentIcon}
                    </button>
                    <button
                        onClick={this.switchToPanel.bind(this, NOTIFICATION_PANEL)}
                        disabled={this.state.whatPanel === NOTIFICATION_PANEL ? true : false}
                    >
                        NOTIFICATION
                    </button>
                    <button
                        onClick={this.switchToPanel.bind(this, CHAT_PANEL)}
                        disabled={this.state.whatPanel === CHAT_PANEL ? true : false}
                    >
                        CHAT
                    </button>
                </div>
                <CSSTransition
                    in={this.state.expanded}
                    appear={true}
                    timeout={300}
                    classNames="expand"
                >
                    <div className="content">
                        {currentPanel}
                    </div>
                </CSSTransition>
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
            "playing" : true,
            "width" : "1280px",
            "height" : "720px",
        };
        this.videoPlayer = React.createRef();
        localStorage.clear();

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

    // handleEnterKey(event) {
    //     if(event.key === "Enter")
    //         this.setVideoURL();
    // }

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
            // document.addEventListener("keydown", this.handleEnterKey.bind(this), false);
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
                    Synchronise
                </button>
                {SEPARATOR}
                <button className="solid" onClick={this.onLeaveServer.bind(this)}>
                    Leave Server
                </button>
            </div>;
        } else {
            // document.removeEventListener("keydown", this.handleEnterKey.bind(this), false);
            serverPanel = <ServerOptions />;
        }

        return (
            <div>
                <Header />
                <GitHubStrip />
                {serverPanel}
                <Footer />
                <BottomPanel />
            </div>
        );
    }
}

export default App;
