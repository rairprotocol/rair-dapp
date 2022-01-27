import React from 'react'

const MainBlock = ({ Metamask, RairLogo, primaryColor }) => {
    return (
        <div className="information-author">
            <div className="home-about-desc">
                <h2 style={{
                color: `${primaryColor === "rhyno" ? "#000" : "#fff"}`,
              }}>Digital
                    Ownership<br />
                    Encryption</h2>
                <div className="autor-about-text" style={{
                color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
              }}>
                    RAIR is a blockchain-based digital rights management platform<br /> that uses NFTs to gate access to streaming content
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

        </div>
    )
}

export default MainBlock
