import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class GitHubStrip extends Component {
    render() {
        return(
            <div className="github-strip-wrapper">
                <div className="github-strip">
                    You can follow this project on
                    &nbsp;
                    <a href="https://github.com/RobustProgram/React-Community-Video-Player"
                       className="github-link">
                        <FontAwesomeIcon icon={["fab", "github-square"]} size="lg" />
                        &nbsp;
                        React Community Video Player
                    </a>
                </div>
            </div>
        );
    }
}

export default GitHubStrip;
