import React from 'react'

const MainBlock = ({ Metamask, RairLogo, primaryColor }) => {
    return (
        <div className="information-author">
            <div className="home-about-desc">
                <h2 style={{
                    color: `${primaryColor === "rhyno" ? "#000" : "#fff"}`,
                }}>Encrypted,<br />
                    Streaming NFTs</h2>
                <div className="autor-about-text" style={{
                    color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
                }}>
                    Our platform makes it possible to attach digital goods<br />
                     to an NFT using encrypted streaming - making today's<br />
                      NFT multi-dimensional.
                </div>
                <div className="btn-buy-metamask">
                    <button>
                        <img
                            className="metamask-logo"
                            src={Metamask}
                            alt="metamask-logo"
                        />{" "}
                        Test our streaming
                    </button>
                </div>
            </div>

        </div>
    )
}

export default MainBlock
