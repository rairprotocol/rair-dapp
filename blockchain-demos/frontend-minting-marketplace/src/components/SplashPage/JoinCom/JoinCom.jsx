import React from 'react'

const JoinCom = ({ JoinCommunity, Metamask }) => {
    return (
        <div className="join-community">
            <div className="title-join">
                <h3><span className="text-gradient">Community</span> rewards</h3>
            </div>
            <div className="community-description">
                <div className="community-text">
                    <p>
                        Private Discord server for the 1000 member Nipseyverse where you
                        will receive exclusive drops before anyone else. First access to
                        NFTs, real world auctions, merch before anyone else.
                    </p>

                    <div className="btn-buy-metamask">
                        <button><img className="metamask-logo" src={Metamask} alt="metamask-logo" />Join with Telegram</button>
                    </div>
                </div>
                <div className="join-pic">
                    <img src={JoinCommunity} alt="photo-join" />
                </div>
            </div>
        </div>
    )
}

export default JoinCom
