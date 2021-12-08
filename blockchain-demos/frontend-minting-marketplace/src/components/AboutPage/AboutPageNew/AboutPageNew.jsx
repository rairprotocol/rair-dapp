import React from 'react';
import './AboutPageNew.css';

import RairLogo from './../assets/rairLogo_blue.png';

const AboutPageNew = () => {
    return (
        <div className="wrapper-about-page">
            <div className="home-about--page">
                <div className="information-author">
                    <div className="home-about-desc">
                        <h2>Digital Ownership Encryption</h2>
                        <div className="autor-about-text">
                            RAIR is a blockchain-based digital rights management platform that uses NFTs to gate access to streaming content
                        </div>
                        <div className="btn-buy-metamask">
                            <button>Mint a token</button>
                        </div>
                    </div>
                    <div className="home-about--logo">
                        <img src={RairLogo} alt="logo" />
                    </div>
                </div>
                <div className="about-page-platform">
                    <div className="platform-box">
                        <div className="platform-title">
                            Whitelabel
                        </div>
                        <div className="categories-list">
                            <ul>
                                <li>Metaverse</li>
                                <li>Marketplace</li>
                                <li>Creation Tools</li>
                                <li>Backend</li>
                            </ul>
                        </div>
                    </div>
                    <div className="platform-box">
                        <div className="platform-title">
                            EVM Support
                        </div>
                        <div className="categories-list">
                            <ul>
                                <li>Ethereum</li>
                                <li>MATIC</li>
                                <li>Binance Smart Chain</li>
                                <li>EVM Integrations</li>
                            </ul>
                        </div>
                    </div>
                    <div className="platform-box">
                        <div className="platform-title">
                            Royalties
                        </div>
                        <div className="categories-list">
                            <ul>
                                <li>On Chain</li>
                                <li>EIP2981 Universal</li>
                                <li>Custom Splits</li>
                                <li>Lock to Contract</li>
                            </ul>
                        </div>
                    </div>
                    <div className="platform-box">
                        <div className="platform-title">
                            Metadata
                        </div>
                        <div className="categories-list">
                            <ul>
                                <li>Bulk Creation</li>
                                <li>Scripting</li>
                                <li>IPFS + Cloud</li>
                                <li>Aggregate to
                                    Opensea et al
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutPageNew
