import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { createServer } from './../socket';

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
        let userName = document.getElementById("username").value;

        if (serverName !== "") {
            if (userName !== "") {
                createServer({serverName: serverName, serverPass: serverPass, userName: userName});
            } else {
                this.setState({error: true, errorMsg: "*You can not have a blank user name!"});
            }

        } else {
            this.setState({error: true, errorMsg: "*You can not have a blank server name!"});
        }
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
                    <div className="input-row">
                        <label for="username">Messaging Name</label>
                        <input id="username" type="text" name="username"/>
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

export default ServerOptions;
