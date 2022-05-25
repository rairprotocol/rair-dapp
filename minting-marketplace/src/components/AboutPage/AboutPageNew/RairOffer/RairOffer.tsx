
import React from 'react'
import { IRairOffer } from '../aboutPage.types'

const RairOffer: React.FC<IRairOffer> = ({ primaryColor }) => {
    return (
        <div className="about-rair-offer">
            <div className="rair-offer-title">
            RAIR <span className="change-color-text">Royalties</span>
            </div>
            <div className="about-offer-content">
                <div className="streaming-box">
                    <div
                        className="streaming-offer"
                        style={{
                            background: `${primaryColor === "rhyno" ? "#989898" : "#383637"}`,
                        }}
                    >
                        <button className="streaming-btn">Streaming</button>
                        <div className="container-progress">
                            <div className="streaming-percent">
                                <div className="percent">15%</div>
                                <div className="percent">10%</div>
                                <div className="percent">7.5%</div>
                            </div>
                            <div className="streaming-progress">
                                <div className="line-purple"></div>
                                <div className="line-grey"></div>
                                <div style={{
                                    color: `${primaryColor === "rhyno" ? "#fff" : "#fff"}`,
                                }}
                                    className="progress-box"
                                >1</div>
                                <div style={{
                                    color: `${primaryColor === "rhyno" ? "#fff" : "#fff"}`,
                                }} className="progress-box">2</div>
                                <div style={{
                                    color: `${primaryColor === "rhyno" ? "#fff" : "#fff"}`,
                                }} className="progress-box">3</div>
                            </div>
                        </div>
                    </div>
                    <div className="streaming-offer non-streaming">
                        <button 
                        style={{color: `${primaryColor === "rhyno" ? "#000" : "#fff"}`}}
                        className="non-streaming-btn">Non-Streaming</button>
                        <div className="container-progress">
                            <div className="streaming-percent non-streaming">
                                <div className="percent">5%</div>
                                <div className="percent">2.5%</div>
                                <div className="percent">1.25%</div>
                            </div>
                            <div className="streaming-progress non-streaming">
                                <div className="line-grey"></div>
                                <div className="line-grey-second"></div>
                                <div style={{
                                    color: `${primaryColor === "rhyno" ? "#fff" : "#fff"}`,
                                }} className="progress-box">1</div>
                                <div style={{
                                    color: `${primaryColor === "rhyno" ? "#fff" : "#fff"}`,
                                }} className="progress-box">2</div>
                                <div style={{
                                    color: `${primaryColor === "rhyno" ? "#fff" : "#fff"}`,
                                }} className="progress-box">3</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rair-offer-text">
                    <p>*Tier 1: Personal • Tier 2: SMB • Tier 3: Enterprise</p>
                </div>
                {/* <div className="royalty-box">
                    <h5>Royalty Schedule</h5>
                    <div className="royalty-list">
                        <ul>
                            <li><span>Tier1 </span>Personal</li>
                            <li><span>Tier2 </span>SMB</li>
                            <li><span>Tier3 </span>Enterprise</li>
                        </ul>
                    </div>
                    <h5>Annual Sales</h5>
                </div> */}
            </div>
        </div>
    )
}

export default RairOffer
