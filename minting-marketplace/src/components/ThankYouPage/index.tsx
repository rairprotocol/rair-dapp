//@ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';

import DiscordIcon from '../SplashPage/images/discord-icon.png';
import logoAuthor from '../SplashPage/images/colab.png';

const ThankYouPage = () => {
    const history = useHistory();

    const goBack = () => {
        history.goBack()
    };

    return (
        <div className="col">
            <div className="nipsey-thank-you-page">
                <div className="information-author">
                    <div className="block-splash">
                        <div className="text-splash">
                            <div className="title-splash nipsey">
                                <h4>Thanks for</h4>
                                <h4>subscribing</h4>
                            </div>
                            <div className="text-description">
                                <div>
                                    You’re on the newsletter list!<br />
                                    and will be the first to know<br />
                                    While you’re here why not..
                                </div>
                            </div>
                            <div className="release-join-discord">
                                <div className="btn-discord">
                                    <a href="https://discord.gg/NFeGnPkbfd" target="_blank" rel="noreferrer"><img src={DiscordIcon} alt="discord icon" /> Join our Discord</a>
                                </div>
                            </div>
                            <div className="btn-back-coming">
                                <button onClick={goBack}>Back</button>
                            </div>
                            <div className="logo-author">
                                {/* <img src={logoDigital} alt="southwest digital" /> */}
                                <img src={logoAuthor} alt="logo-author" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ThankYouPage
