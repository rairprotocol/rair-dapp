import React from 'react'

const JoinCom = ({ JoinCommunity }) => {
    return (
        <div className="join-community">
            <div className="title-join">
                <h3>Join <span className="text-gradient">the</span> community</h3>
            </div>
            <div className="community-description">
                <div className="community-text">
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse
                        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                        cupidatat non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum. Duis aute irure dolor in reprehenderit in
                        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                        sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                        mollit anim id est laborum. Duis aute irure dolor.
                    </p>

                    <div className="btn-buy-metamask">
                        <button>Join with Telegram</button>
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
