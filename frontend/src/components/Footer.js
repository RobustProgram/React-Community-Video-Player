import React, { Component } from 'react';

const VERSION = "0.4.0";

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

export default Footer;
