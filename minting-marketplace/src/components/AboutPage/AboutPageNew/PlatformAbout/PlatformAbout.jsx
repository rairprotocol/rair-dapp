import React from 'react'

const PlatformAbout = () => {
    return (
        <div className="about-page-platform">
            <div className="about-page-platform-title">
                Platform
            </div>
            <div className="about-page-platform-content">
                <div className="platform-box">
                    <div className="platform-title-box">
                        <div className="platform-title">
                            Whitelabel
                        </div>
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
                    <div className="platform-title-box">
                        <div className="platform-title">
                            EVM Support
                        </div>
                    </div>
                    <div className="categories-list">
                        <ul>
                            <li>Ethereum</li>
                            <li>MATIC</li>
                            <li>Binance Smart Chain</li>
                            <li>EIP2535 Diamonds</li>
                        </ul>
                    </div>
                </div>
                <div className="platform-box">
                    <div className="platform-title-box">
                        <div className="platform-title">
                            Royalties
                        </div>
                    </div>
                    <div className="categories-list">
                        <ul>
                            <li>On Chain</li>
                            <li>Lock to Contract</li>
                            <li>Custom Splits</li>
                            <li>EIP2981 Universal</li>
                        </ul>
                    </div>
                </div>
                <div className="platform-box">
                    <div className="platform-title-box">
                        <div className="platform-title">
                            Metadata
                        </div>
                    </div>
                    <div className="categories-list">
                        <ul>
                            <li>Bulk Creation</li>
                            <li>Generative Art</li>
                            <li>IPFS + Cloud</li>
                            <li>Aggregate to
                                Opensea et al
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlatformAbout
