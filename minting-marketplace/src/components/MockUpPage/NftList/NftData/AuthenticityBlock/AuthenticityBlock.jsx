import React from 'react';

const AuthenticityBlock = ({ tokenData, selectedToken }) => {
    return <div className="block-authenticity">
        {/* <div className="authenticity-title">Authenticity</div> */}
        <div className="table-authenticity">
            <div className="table-authenticity-title">Action</div>
            <div className="authenticity-box">
                <div className="link-block">
                    <span><i className="fas fa-external-link-alt"></i></span>
                    {
                        tokenData.map((el, index) => {
                            if (Number(el.token) === Number(selectedToken)) {
                                return (
                                    <a
                                        className="nftDataPageTest-a-hover"
                                        key={index}
                                        href={el?.authenticityLink}
                                        target="_blank" 
                                        rel="noreferrer"
                                    >
                                        Etherscan transaction
                                    </a>
                                );
                            }
                        })
                    }
                </div>
                <div className="block-arrow">
                    <i className="fas fa-arrow-right"></i>
                </div>
            </div>
            <div className="authenticity-box">
                <div className="link-block">
                    <span><i className="fas fa-external-link-alt"></i></span>
                    <p>View on IPFS</p>
                </div>
                <div className="block-arrow">
                    <i className="fas fa-arrow-right"></i>
                </div>
            </div>
        </div>
    </div>
};

export default AuthenticityBlock;
