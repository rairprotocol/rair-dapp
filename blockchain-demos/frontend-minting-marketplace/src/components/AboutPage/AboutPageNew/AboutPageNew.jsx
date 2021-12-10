import React, { useState, useEffect } from 'react';
import './AboutPageNew.css';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// imports images
import RairLogo from './../assets/rairLogo_blue.png';
import NftImage from './../assets/greymanNew.png';
import Nft_1 from './../assets/exclusive_1.jpeg';
import Nft_2 from './../assets/exclusive_2.jpeg';
import Nft_3 from './../assets/exclusive_3.jpeg';
import Nft_4 from './../assets/greyman.png';
import MetamaskTutorial from './../assets/matamaskTutorial.png';
import Metamask from './../assets/metamask_logo.png';
import TeamMeet from '../../SplashPage/TeamMeet/TeamMeetList';

// imports image logos 
import OpenSea from './../assets/openSea-logo.png';
import Rarible from './../assets/rarible-logo.png';
import OneOf from './../assets/oneOf-logo.png';
import Dapper from './../assets/dapper-logo.png';
import MinTable from './../assets/mintable-logo.png';
import Curios from './../assets/curios.png';

const AboutPageNew = ({ primaryColor }) => {
    const [percentTokens, setPersentTokens] = useState(0);

    const leftTokensNumber = 1000;
    const wholeTokens = 1000;

    useEffect(() => {
        if (leftTokensNumber <= wholeTokens) {
            const percentLeft = (leftTokensNumber * 100) / wholeTokens;
            if (percentLeft > 1) {
                setPersentTokens(Math.floor(percentLeft));

            }
            else if (percentLeft > 990) {
                setPersentTokens(Math.floor(percentLeft));
            }
            else {
                setPersentTokens(Math.ceil(percentLeft));
                console.log(percentLeft)
            }
        }
        if (leftTokensNumber > wholeTokens) {
            setPersentTokens(100)
        }
    }, [setPersentTokens])

    return (
        <div className="wrapper-about-page">
            <div className="home-about--page">
                <div className="information-author">
                    <div className="home-about-desc">
                        <h2>Digital Ownership Encryption</h2>
                        <div className="autor-about-text">
                            RAIR is a blockchain-based digital rights management platform that uses NFTs to gate access to streaming content
                        </div>
                        <div className="btn-buy-metamask">
                            <button>Mint a token</button>
                        </div>
                    </div>
                    <div className="home-about--logo">
                        <img src={RairLogo} alt="logo" />
                    </div>
                </div>
                <div className="left-tokens about-page">
                    <div className="block-left-tokens">
                        <div
                            className="progress-tokens"
                            style={{ background: `${primaryColor === "rhyno" ? "rgba(34, 32, 33, 0.4)" : "rgba(34, 32, 33, 0.6)"}` }}
                        >
                            <div className="title-progress-left">
                                NFTs remaining
                            </div>
                            <Box className="box-progress" sx={{ position: 'relative' }}>
                                <CircularProgress
                                    className="progress-grey"
                                    variant="determinate"
                                    sx={{
                                        color: (theme) =>
                                            theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                                    }}
                                    size={40}
                                    thickness={1.5}
                                    value={100}
                                />
                                <CircularProgress
                                    className="progress-main"
                                    variant="determinate"

                                    sx={{
                                        color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                                        position: 'absolute',
                                        left: 0,
                                    }}
                                    size={40}
                                    thickness={4}
                                    value={percentTokens}
                                />
                            </Box>
                            <div
                                className="text-progress"
                                style={{ fontSize: `${leftTokensNumber === 1000 && "32px"}` }}
                            >
                                <div className="progress-info">
                                    <div className="text-numbers">
                                        <div className="text-left-tokens text-gradient">{leftTokensNumber} </div>
                                        <div className="text-whole-tokens"> / {wholeTokens}</div>
                                    </div>
                                    <div>left</div>
                                </div>
                            </div>
                        </div>
                        <div className="down-text">
                            Minting on demand secures your NFT on the blockhain.Unique <br />
                            artwork to follow based on examples shown.
                        </div>
                    </div>
                    <div className="left-tokens-content">
                        <div className="title-tokens">
                            <h3><span className="text-gradient">Mission</span></h3>
                        </div>
                        <div className="tokens-description">
                            <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>
                                Data monopolies like Amazon, YouTube, Google,
                                Apple, and Netflix charge onerous fees, offer opaque
                                analytics, and can change their terms of service at any
                                time locking out creators and users alike.

                            </p>
                            <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>
                                DIY distribution meanwhile offers no protection, and
                                cannot help package works into a scarce, valuable,
                                tradeable framework.
                            </p>
                            <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>
                                RAIR, through its decentralized key management
                                node system, empowers anyone to create unique,
                                controllable, and transferable digital assets tied to
                                the actual underlying content.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="about-page-platform">
                    <div className="platform-box">
                        <div className="platform-title">
                            Whitelabel
                        </div>
                        <div className="categories-list">
                            <ul>
                                <li>Metaverse</li>
                                <li>Marketplace</li>
                                <li>Creation Tools</li>
                                <li>Backend</li>
                            </ul>
                        </div>
                    </div>
                    <div className="platform-box">
                        <div className="platform-title">
                            EVM Support
                        </div>
                        <div className="categories-list">
                            <ul>
                                <li>Ethereum</li>
                                <li>MATIC</li>
                                <li>Binance Smart Chain</li>
                                <li>EVM Integrations</li>
                            </ul>
                        </div>
                    </div>
                    <div className="platform-box">
                        <div className="platform-title">
                            Royalties
                        </div>
                        <div className="categories-list">
                            <ul>
                                <li>On Chain</li>
                                <li>EIP2981 Universal</li>
                                <li>Custom Splits</li>
                                <li>Lock to Contract</li>
                            </ul>
                        </div>
                    </div>
                    <div className="platform-box">
                        <div className="platform-title">
                            Metadata
                        </div>
                        <div className="categories-list">
                            <ul>
                                <li>Bulk Creation</li>
                                <li>Scripting</li>
                                <li>IPFS + Cloud</li>
                                <li>Aggregate to
                                    Opensea et al
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="about-rair-offer">
                    <div className="rair-offer-title">
                        Only RAIR Offers <span className="change-color-text">encrypted streaming</span>
                    </div>
                    <div className="about-offer-content">
                        <div className="streaming-box">
                            <div className="streaming-offer">
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
                                        <div className="progress-box">1</div>
                                        <div className="progress-box">2</div>
                                        <div className="progress-box">3</div>
                                    </div>
                                </div>
                            </div>
                            <div className="streaming-offer non-streaming">
                                <button className="non-streaming-btn">Non-Streaming</button>
                                <div className="container-progress">
                                    <div className="streaming-percent non-streaming">
                                        <div className="percent">5%</div>
                                        <div className="percent">2.5%</div>
                                        <div className="percent">1.25%</div>
                                    </div>
                                    <div className="streaming-progress non-streaming">
                                        <div className="line-grey"></div>
                                        <div className="line-grey-second"></div>
                                        <div className="progress-box">1</div>
                                        <div className="progress-box">2</div>
                                        <div className="progress-box">3</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="royalty-box">
                            <h5>Royalty Schedule</h5>
                            <div className="royalty-list">
                                <ul>
                                    <li><span>Tier1 </span>Personal</li>
                                    <li><span>Tier2 </span>SMB</li>
                                    <li><span>Tier3 </span>Enterprise</li>
                                </ul>
                            </div>
                            <h5>Annual Sales</h5>
                        </div>
                    </div>
                </div>
                <div className="exclusive-nfts">
                    <div className="title-nft">
                        <h3>View our <span className="change-color-text">projects</span></h3>
                    </div>
                    <div className="nfts-select">
                        <div className="main-nft" style={{
                            background: `url(${NftImage}) no-repeat`,
                            backgroundSize: "contain",
                            backgroundPosition: "center center"
                        }}>
                            <div className="btn-open-store">
                                <span>Open in Store</span> <i className="fas fa-arrow-right"></i>
                            </div>
                        </div>
                        <div className="block-nfts">
                            <div className="box-nft">
                                <img src={Nft_4} alt="img" />
                                <img src={Nft_2} alt="img" />
                            </div>
                            <div className="box-nft">
                                <img src={Nft_3} alt="img" />
                                <img src={Nft_1} alt="img" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="about-streams-video">
                    <div className="about-streams-video-title">Test our  <span className="change-color-text">streams</span></div>
                    <div className="about-video-tutorial-text">
                        Watch our tutorial video on Web2 to learn how to watch encrypted videos on Web3.
                    </div>
                    <div className="box-video">
                        <iframe width="978" height="549" src="https://www.youtube.com/embed/tgbNymZ7vqY">
                        </iframe>
                    </div>
                    <div className="about-video-tutorial-text">
                        You’ll need Metamask and a watch token to  play our encrypted streams. No middleman necessary.
                    </div>
                    <div className="tutorial-with-metamask">
                        <div className="container-content-metamask">
                            <div className="metamask-box">
                                <img src={MetamaskTutorial} alt="photo metamask" />
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
                            <div className="container-block-video">
                                <div className="block-videos">
                                    <div className="box-video">
                                        <div
                                            className="video-locked"
                                            style={{ background: `${primaryColor === "rhyno" ? "#fff" : "#4E4D4DCC"}` }}
                                        >
                                            <div style={{ position: "relative" }}>
                                                <div className="video-icon">
                                                    <i className="fa fa-lock"></i>
                                                    <p>RAIR  Exclusive</p>
                                                </div>
                                                <img src={Nft_3} alt="unlockble video" />
                                            </div>
                                            <div className="video-description">
                                                <div className="video-title">
                                                    <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#fff"}` }}>How RAIR Works</p>
                                                </div>
                                                <div className="video-timer">
                                                    <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>00:05:33</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="box-video">
                                        <div
                                            className="video-locked"
                                            style={{ background: `${primaryColor === "rhyno" ? "#fff" : "#4E4D4DCC"}` }}
                                        >
                                            <div style={{ position: "relative" }}>
                                                <div className="video-icon">
                                                    <i className="fa fa-lock"></i>
                                                    <p>RAIR  Exclusive</p>
                                                </div>
                                                <img src={Nft_3} alt="unlockble video" />
                                            </div>
                                            <div className="video-description">
                                                <div className="video-title">
                                                    <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#fff"}` }}>Expansion Plan</p>
                                                </div>
                                                <div className="video-timer">
                                                    <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>00:05:33</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="box-video">
                                        <div
                                            className="video-locked"
                                            style={{ background: `${primaryColor === "rhyno" ? "#fff" : "#4E4D4DCC"}` }}
                                        >
                                            <div style={{ position: "relative" }}>
                                                <div className="video-icon">
                                                    <i className="fa fa-lock"></i>
                                                    <p>RAIR  Exclusive</p>
                                                </div>
                                                <img src={Nft_3} alt="unlockble video" />
                                            </div>
                                            <div className="video-description">
                                                <div className="video-title">
                                                    <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#fff"}` }}>Development Roadmap</p>
                                                </div>
                                                <div className="video-timer">
                                                    <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>00:05:33</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="box-video">
                                        <div
                                            className="video-locked"
                                            style={{ background: `${primaryColor === "rhyno" ? "#fff" : "#4E4D4DCC"}` }}
                                        >
                                            <div style={{ position: "relative" }}>
                                                <div className="video-icon">
                                                    <i className="fa fa-lock"></i>
                                                    <p>RAIR  Exclusive</p>
                                                </div>
                                                <img src={Nft_3} alt="unlockble video" />
                                            </div>
                                            <div className="video-description">
                                                <div className="video-title">
                                                    <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#fff"}` }}>Fun Projects</p>
                                                </div>
                                                <div className="video-timer">
                                                    <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>00:05:33</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-watch-token">
                                    To stream the videos above you’ll need to mint<br />
                                    a watch token for .1 MATIC
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                <div className="about-roadmap">
                    <div className="about-road-title">2022 Roadmap</div>
                    <div className="about-map-item">
                        <div className="map-item-progress">
                            <div className="map-progress">
                                <div className="line-purple"></div>
                                <div className="line-grey"></div>
                                <div className="progress-box">Q1</div>
                                <div className="progress-box">Q2</div>
                                <div className="progress-box">Q3</div>
                            </div>
                            <div className="progress-title">
                                Curation
                            </div>
                        </div>
                        <div className="map-item-desc">
                            <p>EVM NFT suite for Ethereum, Matic, BSC</p>
                            <p>Custom minting, royalty splits, aggregation</p>
                            <p>Encrypted streaming video</p>
                        </div>
                    </div>
                    <div className="about-map-item">
                        <div className="map-item-progress">
                            <div className="progress-title">
                                Private
                            </div>
                            <div className="map-progress">
                                <div className="line-private"></div>
                                <div className="line-grey"></div>
                                <div className="progress-box">Q2</div>
                                <div className="progress-box">Q3</div>
                                <div className="progress-box">Q4</div>
                            </div>
                        </div>
                        <div className="map-item-desc">
                            <p>Scale to customer</p>
                            <p>EVM Aidrops to token holders</p>
                            <p>Curated marketplace</p>
                        </div>
                    </div>
                    <div className="about-map-item">
                        <div className="map-item-progress">
                            <div className="map-progress">
                                <div className="line-public"></div>
                                <div className="line-grey"></div>
                                <div className="progress-box">Q3</div>
                                <div className="progress-box">Q4</div>
                                <div className="progress-box">Q5</div>
                            </div>
                            <div className="progress-title">
                                Public
                            </div>
                        </div>
                        <div className="map-item-desc">
                            <p>Toolset release for all creators</p>
                            <p>Encrypted data streaming</p>
                            <p>Marketplaces for NFT stakers</p>
                        </div>
                    </div>
                </div>
                <div className="about-compare">
                    <div className="about-compare-title">Compare</div>
                    <div className="about-compare-content">
                        <div className="about-compare-steams">
                            <table className="about-table-compare">
                                <thead className="table-head-compare">
                                    <th>
                                        <div className="th-title">
                                            Streaming
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-title">
                                            Platform
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-title">
                                            Whitelabel
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-title">
                                            EVM Support
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-title">
                                            Royalties
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-title">
                                            Metadata
                                        </div>
                                    </th>
                                </thead>
                                <tbody className="table-tbody-compare">
                                    <tr>
                                        <td>
                                            <div className="circle-table">
                                                <i class="fas fa-check"></i>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="circle-table-img">
                                                <img src={RairLogo} alt="" />
                                            </div>
                                        </td>
                                        <td>
                                            Metaverse
                                            as-a-Service
                                        </td>
                                        <td>Any EVM</td>
                                        <td>Universal
                                            Onchain</td>
                                        <td>
                                            Provenance
                                            & Speed
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="circle-table">
                                                <i class="fas fa-times"></i>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="circle-table-img">
                                                <img src={OpenSea} alt="" />
                                            </div>
                                        </td>
                                        <td>Just another
                                            Opensea Page</td>
                                        <td>Limited
                                            EVMs</td>
                                        <td>
                                            2.5%
                                            Offchain
                                        </td>
                                        <td>Lazyminted</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="circle-table">
                                                <i class="fas fa-times"></i>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="circle-table-img">
                                                <img src={Rarible} alt="" />
                                            </div>
                                        </td>
                                        <td>
                                            Just another
                                            Rarible Page
                                        </td>
                                        <td>
                                            ETH
                                            Only
                                        </td>
                                        <td>2.5%
                                            Offchain</td>
                                        <td>Lazyminted</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="circle-table">
                                                <i class="fas fa-times"></i>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="circle-table-img">
                                                <img src={OneOf} alt="" />
                                            </div>
                                        </td>
                                        <td>Not your
                                            Brand</td>
                                        <td>Only Tezos </td>
                                        <td>Stuck on
                                            Tezos</td>
                                        <td>Stuck on
                                            Tezos</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="circle-table">
                                                <i class="fas fa-times"></i>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="circle-table-img">
                                                <img src={Dapper} alt="" />
                                            </div>
                                        </td>
                                        <td>Need
                                            Flow devs</td>
                                        <td>Only Flow</td>
                                        <td>Stuck on
                                            Flow</td>
                                        <td>Stuck on
                                            Flow</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="circle-table">
                                                <i class="fas fa-times"></i>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="circle-table-img">
                                                <img src={MinTable} alt="" />
                                            </div>
                                        </td>
                                        <td>Just another
                                            Mintable Page</td>
                                        <td>ETH</td>
                                        <td>5%</td>
                                        <td>Lazyminted</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="circle-table">
                                                <i class="fas fa-times"></i>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="circle-table-img">
                                                <img src={Curios} alt="" />
                                            </div>
                                        </td>
                                        <td>Curios
                                            Backend</td>
                                        <td>MATIC</td>
                                        <td>5%
                                            Offchain</td>
                                        <td>Lazyminted</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="about-page--team">
                    <TeamMeet primaryColor={primaryColor} arraySplash={"rair"} />
                </div>
                <div className="about-page--team">
                    <TeamMeet primaryColor={primaryColor} arraySplash={"rair-advisors"} />
                </div>
            </div>
        </div >
    )
}

export default AboutPageNew
