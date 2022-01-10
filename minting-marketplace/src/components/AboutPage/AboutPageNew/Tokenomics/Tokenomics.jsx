import React from 'react'

const Tokenomics = ({ Metamask }) => {
    return (
        <div className="about-tokenomics">
            <div className="about-tokenomics-title">
                <span className="change-color-text">Tokenomics</span>
            </div>
            <div className="tokenomics-ecosystem">
                <div className="ecosystem-list">
                    <div className="ecosystem-list-text">
                        RAIR is the fuel that powers the RAIR ecosystem<br />
                        Only 10,000,000 will ever be minted
                    </div>
                    <div className="tokenomics-block-list">
                        <div className="tokenomics-items">
                            <div className="items-title">EVM Airdrops</div>
                            <p>
                                1 ETH RAIR = 1 EVM RAIR<br />
                                on snapshot date
                            </p>
                        </div>
                        <div className="tokenomics-items">
                            <div className="items-title">Mint NFTs</div>
                            <p>
                                Deploy ERC721 contracts on any<br />
                                supported EVM for 15 RAIR
                            </p>
                        </div>
                        <div className="tokenomics-items">
                            <div className="items-title">Stake for Membership</div>
                            <p>
                                Deploy custom storefront requires<br />
                                staking 1,000 RAIR tokens
                            </p>
                        </div>
                    </div>
                    <div className="btn-buy-metamask">
                        <button>
                            <img
                                className="metamask-logo"
                                src={Metamask}
                                alt="metamask-logo"
                            />{" "}
                            Buy RAIR
                        </button>
                    </div>
                </div>
                <div className="ecosystem-airdrops">
                    <div className="ecosystem-airdrops-text">
                        RAIR Token holders will <br />
                        receive <span>airdrops</span> for every<br />
                        EVM compatible chain we <br />
                        integrate with.<br />
                    </div>
                    <div className="ecosystem-airdrops-list">
                        <div className="airdrops-items">
                            <div className="items-title">Q1  2022</div>
                            <ul>
                                <li>MATIC</li>
                                <li>Binance Smart Chain</li>
                                <li>Klatyn</li>
                            </ul>
                        </div>
                        <div className="airdrops-items">
                            <div className="items-title">Q2  2022</div>
                            <ul>
                                <li>Ethereum Classic</li>
                                <li>IoTex</li>
                                <li>Avalanche</li>
                                <li>Arbitreaum</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tokenomics
