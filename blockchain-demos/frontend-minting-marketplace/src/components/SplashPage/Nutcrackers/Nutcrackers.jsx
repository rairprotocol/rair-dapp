import React from 'react'

const Nutcrackers = () => {
    return (
        <div className="wrapper-splash-page">
            <div className="home-splash--page">
                <div className="information-author">
                    <div className="block-splash">
                        {/* <img className="block-img-mobile" src={NipseyBg} alt="nipsey-hussle" /> */}
                        <div className="text-splash">
                            <div className="title-splash nipsey">
                                <h3>Enter the</h3>
                                <span>Nipseyverse</span>
                            </div>
                            <div className="text-description">
                                <div>
                                    1000 unique NFTs unlock exclusive streaming for the
                                    final Nipsey Hussle album.
                                    Proceeds directly benefit the Airmiess
                                    Asghedom estate <a href="https://etherscan.io/Oxcontract" target="_blank">onchain</a>.
                                </div>
                            </div>
                            <div className="btn-timer-nipsey">

                                {/* <button onClick={openModal}>
                  <img
                    className="metamask-logo"
                    src={Metamask}
                    alt="metamask-logo"
                  />{" "}
                  Preorder with ETH
                </button> */}
                            </div>
                            {/* <div className="logo-author">

                            <img src={logoAuthor} alt="logo-author" />
                        </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Nutcrackers
