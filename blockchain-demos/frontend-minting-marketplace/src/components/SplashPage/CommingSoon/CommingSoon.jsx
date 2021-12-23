import React from 'react';
import DiscordIcon from './../images/discord-icon.png';
import logoAuthor from './../images/colab.png';

const CommingSoon = () => {
    return (
        <div className="col-12">
            <div className="nipsey-comming-soon">
                <div className="information-author">
                    <div className="block-splash">
                        <div className="text-splash">
                            <div className="title-splash nipsey">
                                <span>Comming soon</span>
                            </div>
                            <div className="text-description">
                                <div>
                                    Marketplace will be live after the official launch. In the meantime.
                                </div>
                            </div>
                            <div className="release-join-discord">
                                <div className="btn-discord">
                                    <a href="https://discord.gg/NFeGnPkbfd" target="_blank" rel="noreferrer"><img src={DiscordIcon} alt="discord icon" /> Join our Discord</a>
                                </div>
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

export default CommingSoon
