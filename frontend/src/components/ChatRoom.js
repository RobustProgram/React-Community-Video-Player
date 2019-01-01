import React, { Component } from 'react';

import { uploadMessage, receiveMessageUpdate } from './../socket';

class ChatRoom extends Component {
    constructor(props) {
        super(props);

        let initial_messages = JSON.parse(localStorage.getItem('messages'));
        if (initial_messages == null)
            this.state = { messages : [] };
        else
            this.state = { messages : initial_messages };

        receiveMessageUpdate((data) => {
            let messages = this.state.messages;
            messages.push(data);
            this.setState({message: messages});
        });
    }

    sendMessage() {
        let message = document.getElementById("chat-message").value;
        document.getElementById("chat-message").value = "";
        uploadMessage(message);
    }

    componentWillUnmount() {
        // Store the notification in memory
        localStorage.setItem('messages', JSON.stringify(this.state.messages));
    }

    render() {
        let messages = [];
        for(let message in this.state.messages)
            messages.push(<div key={message}>{this.state.messages[message]}</div>);

        return(
            <div className="chat-panel">
                <div className="chat-history">
                    {messages};
                </div>
                <div className="chat-input-area">
                    <input id="chat-message" type="text" name="chat-message"/>
                    <button className="solid" onClick={this.sendMessage.bind(this)}>
                        Send Message
                    </button>
                </div>
            </div>
        );
    }
}

export default ChatRoom;
