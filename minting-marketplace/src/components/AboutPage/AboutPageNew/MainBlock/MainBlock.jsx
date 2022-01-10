import React from 'react'

const MainBlock = ({Metamask, RairLogo}) => {
    return (
        <div className="information-author">
            <div className="home-about-desc">
                <h2>Digital Ownership Encryption</h2>
                <div className="autor-about-text">
                    RAIR is a blockchain-based digital rights management platform that uses NFTs to gate access to streaming content
                </div>
                <div className="btn-buy-metamask">
                    <button>
                        <img
                            className="metamask-logo"
                            src={Metamask}
                            alt="metamask-logo"
                        />{" "}
                        Mint a token
                    </button>
                </div>
            </div>
            <div className="home-about--logo">
                <img src={RairLogo} alt="logo" />
            </div>
        </div>
    )
}

export default MainBlock
