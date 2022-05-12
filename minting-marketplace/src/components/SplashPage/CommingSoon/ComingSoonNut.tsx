//@ts-nocheck
import React from 'react';
// import DiscordIcon from './../images/discord-icon.png';
// import logoAuthor from './../images/colab.png';
import { useHistory } from 'react-router-dom';
import Main from '../images/nuts-main.png';

const ComingSoonNut = () => {
    const history = useHistory();

    const goBack = () => {
        history.goBack();
    }

    return (
        <div className="col-12">
            <div className="nipsey-comming-soon nutcrackers">
                <div className="information-author">
                    <div className="img-coming-nuts">
                        <img src={Main} alt="logo" />
                    </div>
                    <div className="block-splash">
                        <div className="text-splash">
                            <div className="title-splash nipsey">
                                <span>Coming soon</span>
                            </div>
                            <div className="text-description">
                                <div>
                                    Marketplace will be live after the official launch. In the meantime.
                                </div>
                            </div>
                            <div className="btn-back-coming">
                                <button onClick={goBack}>Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ComingSoonNut
