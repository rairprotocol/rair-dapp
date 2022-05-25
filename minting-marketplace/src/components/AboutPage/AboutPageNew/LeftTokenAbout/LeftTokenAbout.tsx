
import React from 'react';
import { ILeftTokenAbout } from '../aboutPage.types';
import DiscordIcon from './../../../SplashPage/images/discord-icon.png';

const LeftTokenAbout: React.FC<ILeftTokenAbout> = ({ primaryColor }) => {
    return (
        <div className="left-tokens about-page">
            <div className="block-left-tokens">

            </div>
            <div className="left-tokens-content">
                <div className="title-tokens">
                    <h3><span className="text-gradient">Mission</span></h3>
                </div>
                <div className="tokens-description">
                    <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#fff"}` }}>
                        RAIRtech has developed a new way to control content on the
                        blockchain called DDRM or distributed digital rights management.

                    </p>
                    <ul>
                        <li>
                            <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#fff"}` }}>
                                Allows for encrypted streaming of videos, music, images and data
                            </p>
                        </li>
                        <li>
                            <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#fff"}` }}>
                                Only the owner of the NFT can stream the content
                                this makes digital goods work like real goods
                            </p>
                        </li>
                        <li>
                            <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#fff"}` }}>
                                Feature complete platform: minting, streaming, royalties & metadata
                            </p>
                        </li>
                    </ul>
                    <div className="release-join-discord">
                    <div className="btn-discord">
                        <a href="https://discord.gg/APmkpQzxrx" target="_blank" rel="noreferrer"><img src={DiscordIcon} alt="discord icon" /> Join our Discord</a>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default LeftTokenAbout
