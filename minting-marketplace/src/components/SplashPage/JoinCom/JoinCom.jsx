import React from 'react'

const JoinCom = ({ JoinCommunity, Metamask, primaryColor }) => {
    return (
        <div className="join-community">
            <div className="title-join">
                <h3><span className="text-gradient">Community</span> rewards</h3>
            </div>
            <div
                className="community-description"
                style={{ background: `${primaryColor === "rhyno" ? "#fff" : "#383637"}` }}
            >
                <div className="community-text">
                    <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>
                        Private Discord server for the 1000 member Nipseyverse where you
                        will receive exclusive drops before anyone else. First access to
                        NFTs, real world auctions, merch before anyone else.
                    </p>

                    <div className="btn-buy-metamask">
                        <button><img className="metamask-logo" src={Metamask} alt="metamask-logo" />Join with Telegram</button>
                    </div>
                </div>
                <div className="join-pic">
                    <img src={JoinCommunity} alt="community-img" />
                </div>
            </div>
        </div>
    )
}

export default JoinCom