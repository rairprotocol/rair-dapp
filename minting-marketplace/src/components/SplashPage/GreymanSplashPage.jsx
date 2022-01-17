import React, {useState, useCallback} from "react";
import { useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";

import "./SplashPage.css";
import Modal from "react-modal";

/* importing images*/
import Metamask from "./images/metamask_logo.png";
import GreyMan from "./images/greyman1.png";

/* importing Components*/
// import ExclusiveNft from "./ExclusiveNft/ExclusiveNft";
import TeamMeet from "./TeamMeet/TeamMeetList";
import TokenLeftGreyman from "./TokenLeft/TokenLeftGreyman";
import AuthorBlock from "./AuthorBlock/AuthorBlock";

import { erc721Abi } from '../../contracts/index.js'
import { rFetch } from '../../utils/rFetch.js';
import { web3Switch } from '../../utils/switchBlockchain.js';
import Swal from 'sweetalert2';
import NotCommercial from "./NotCommercial/NotCommercial";

const customStyles = {
    overlay: {
      zIndex: "1",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      display: "flex",
      flexDirection: "column",
      alignContent: "center",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
      fontFamily: "Plus Jakarta Text",
      borderRadius: "16px",
    },
  };
Modal.setAppElement("#root");

const SplashPage = () => {
  const GraymanSplashPageTESTNET = '0x1bf2b3aB0014d2B2363dd999889d407792A28C06';
  const { primaryColor } = useSelector((store) => store.colorStore);
  const [active, setActive] = useState({ policy: false, use: false });
  const [modalIsOpen, setIsOpen] = useState(false);
//   const history = useHistory();
  const { minterInstance, contractCreator } = useSelector((store) => store.contractStore);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  function afterOpenModal() {
    subtitle.style.color = "#9013FE";
  }

  function closeModal() {
    setIsOpen(false);
    setActive(prev => ({
      ...prev,
      policy: false,
      use: false
    }))
  }

  const buyGrayman = async () => {
    if (window.ethereum.chainId !== '0x13881') {
        web3Switch('0x13881');
        return;
    }

    const { success, products } = await rFetch(`/api/contracts/network/0x13881/${GraymanSplashPageTESTNET}/products/offers`);
    if (success) {
        let instance = contractCreator(GraymanSplashPageTESTNET, erc721Abi);
        let nextToken = await instance.getNextSequentialIndex(0, 0, 50);
        Swal.fire({
          title: 'Please wait...',
          html: `Buying Grayman #${nextToken.toString()}`,
          icon: 'info',
          showConfirmButton: false
        });
        let [greyworldOffer] = products[0].offers.filter(item => item.offerName === 'greyworld');
        if (!greyworldOffer) {
          Swal.fire('Error', 'An error has ocurred', 'error');
          return;
        }
        try {
          await (await minterInstance.buyToken(
            products[0].offerPool.marketplaceCatalogIndex,
            greyworldOffer.offerIndex,
            nextToken,
            {
              value: greyworldOffer.price
            }
          )).wait();
          Swal.fire('Success', `Bought Grayman #${nextToken}!`, 'success');
        } catch (e) {
          console.error(e);
          Swal.fire('Error', e?.message, 'error');
        }
    }
  };
  
  let subtitle;

  return (
    <div className="wrapper-splash-page greyman-page">
      <div className="home-splash--page">
        <AuthorBlock mainClass="greyman-page-author">
          <div className="block-splash">
            <div className="text-splash">
              <div className="title-splash greyman-page">
                <h3>
                  "All greymen are grey, but some are more grey than others." -
                  Dadara
                </h3>
                <h3 style={{fontSize: '56px', paddingBottom: '17px'}} className="text-gradient-grey">#Cryptogreyman</h3>
              </div>
              <div className="text-description">
                <p>
                  7.907.414.597 non-unique NFTs. All metadata is identical only
                  the serial number changes. Claim yours for 2 MATIC
                </p>
              </div>
              <div className="btn-buy-metamask">
                <button onClick={openModal}>
                  <img
                    className="metamask-logo"
                    src={Metamask}
                    alt="metamask-logo"
                  />{" "}
                  Mint with Matic
                </button>
              </div>
              <div className="btn-timer-nipsey">
                <Modal
                  isOpen={modalIsOpen}
                  onAfterOpen={afterOpenModal}
                  onRequestClose={closeModal}
                  style={customStyles}
                  contentLabel="Example Modal"
                >
                  <h2
                    style={{
                      fontSize: "60px",
                      fontWeight: "bold",
                      paddingTop: "3rem",
                      cursor: "default",
                    }}
                    ref={(_subtitle) => (subtitle = _subtitle)}
                  >
                    Terms of Service
                  </h2>
                  {/* <button onClick={closeModal}>close</button> */}
                  <div className="modal-content-wrapper">
                    <div className="modal-form">
                      <form>
                        <div className="form-group">
                          <input type="checkbox" id="policy" />
                          <label onClick={() => setActive(prev => ({ ...prev, policy: !prev.policy }))} htmlFor="policy">I agree to the </label>
                          <span
                            onClick={() =>
                              window.open("/privacy", "_blank")
                            }
                            style={{
                              color: "#9013FE",
                              fontSize: "24px",
                              paddingRight: "1rem",
                              marginLeft: "-2.5rem",
                            }}
                          >
                            Privacy Policy
                          </span>
                        </div>
                        <div className="form-group sec-group ">
                          <input type="checkbox" className="dgdfgd" id="use" />
                          <label onClick={() => setActive(prev => ({ ...prev, use: !prev.use }))} htmlFor="use">I accept the </label>
                          <span
                            onClick={() => window.open("/terms-use", "_blank")}
                            style={{
                              color: "#9013FE",
                              fontSize: "24px",
                              paddingRight: "2.3rem",
                              marginLeft: "-2.5rem",
                            }}
                          >
                            Terms of Use
                          </span>
                        </div>
                      </form>
                    </div>
                    <div className="modal-content-np">
                      <div className="modal-text-wrapper">
                        <span className="modal-text">
                          I understand this is a prerelease NFT. Final artwork
                          and access to encrypted streams will be associated
                          with your NFT serial number at the time of launch.
                        </span>
                      </div>
                      <div className="modal-btn-wrapper">
                        <button onClick={buyGrayman} 
                        disabled={!Object.values(active).every(el => el)} 
                        className="modal-btn">
                          <img
                            className="metamask-logo modal-btn-logo"
                            src={Metamask}
                            alt="metamask-logo"
                          />{" "}
                          PURCHASE
                        </button>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </AuthorBlock>
        <TokenLeftGreyman Metamask={Metamask} primaryColor={primaryColor} />
        {/* <ExclusiveNft
                    Nft_1={GreyMan}
                    Nft_2={GreyMan}
                    Nft_3={GreyMan}
                    Nft_4={GreyMan}
                    NftImage={GreyMan}
                    amountTokens={"7,907,414,597"}
                /> */}
        <div className="about-metadata-wrapper">
          <div className="about-metadata">
            <h1
              style={{
                color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
              }}
            >
              <span style={{ color: "white" }}>What is </span>{" "}
              <span style={{ color: "grey" }}>Metadata</span>
            </h1>
            <p
              style={{
                color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
              }}
            >
              When a painting hangs on a wall, it’s always there for us to
              enjoy. No electricity, no internet connection needed. No
              distractions, pings, and notifications calling us while we try to
              focus on the art. We can create our own bubble with the physical
              piece of art. It’s always there for us. We can admire the brush
              strokes from close by, and clearly see and feel that not one of
              them is the same. And in a world where everything is in flux and
              constant change, the painting is not changing, inviting us to go
              deeper and deeper and discover more aspects of it all the time.
              The painting remains the same, but our perception of it and
              relationship to it becomes deeper and more intimate.
            </p>
            <p
              style={{
                color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
              }}
            >
              So why artificially limit our NFTs to a one of one? We can create
              enough for everyone. There are 7.908.125.000 people on this planet
              as of the time of writing. So, we created 7.908.125.000 NFTs. And
              all are identical. No rare traits or characteristics which would
              artificially make one Greyman worth more than another - each and
              every one of those Greymen is exactly the same! The only thing
              that is different is their numeric identification: you can obtain
              number 5, or number 1971, or number 3.427.903.612. And actually,
              that is exactly what an NFT is about: it’s a number registered on
              the blockchain. And isn’t that what nowadays is also identifying
              us as human beings – just a number? After all, our social security
              number is what defines us increasingly in our current society. Or
              our geographical location, or our Metamask address, or…..
            </p>
          </div>
          <div className="about-metadata-second-block-wrapper">
            <div className="about-metadata-second-block">
              <p
                style={{
                  color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
                }}
              >
                Metadata is how NFT serial numbers render information
              </p>
              <p
                style={{
                  color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
                }}
              >
                The Greyman contract on the{" "}
                <span
                  style={{
                    fontWeight: "bolder",
                    fontSize: "18px",
                    color: "#c1c1c1",
                  }}
                >
                  MATIC blockchain
                </span>{" "}
                points to{" "}
                <span
                  style={{
                    fontWeight: "bolder",
                    fontSize: "18px",
                    color: "#c1c1c1",
                  }}
                >
                  {" "}
                  a metadata
                </span>
                JSON file with properties
              </p>
              <p
                style={{
                  color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
                }}
              >
                MATIC works just like Ethereum, but is less expensive and energy
                intense to point to metadata
              </p>
              <p
                style={{
                  color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
                }}
              >
                The metadata files we point to are hosted on IPFS so they don’t
                get lost, censored, or tampered with
              </p>
              <p
                style={{
                  color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
                }}
              >
                Metadata is then rendered by any free browser
              </p>
            </div>
          </div>
        </div>

        <div className="join-community">
          <div className="title-join">
            <h3>
              <span>
                Only <span className="text-gradient">7.907.414.597</span> NFTs
                will ever be minted
              </span>
              {/* <span className="text-gradient">Community</span> rewards */}
            </h3>
          </div>
          <div className="main-greyman-pic-wrapper">
            <div className="main-greyman-pic">
              <div className="join-pic-main">
                <div className="show-more-wrap">
                  <span className="show-more">
                    Open in Store <span className="show-more-arrow">→</span>{" "}
                  </span>
                </div>
                <img
                  className="join-pic-main-img"
                  src={GreyMan}
                  alt="community-img"
                />
              </div>
            </div>
            <div className="list-of-greymans-pic">
              <div className="join-pic">
                <img
                  className="join-pic-img"
                  src={GreyMan}
                  alt="community-img"
                />
              </div>
              <div className="join-pic">
                <img
                  className="join-pic-img"
                  src={GreyMan}
                  alt="community-img"
                />
              </div>
              <div className="join-pic">
                <img
                  className="join-pic-img"
                  src={GreyMan}
                  alt="community-img"
                />
              </div>
              <div className="join-pic">
                <img
                  className="join-pic-img"
                  src={GreyMan}
                  alt="community-img"
                />
              </div>
            </div>
          </div>
          {/* <div
            className="community-description"
            style={{
              background: `${primaryColor === "rhyno" ? "#fff" : "#383637"}`,
            }}
          >
            <div className="community-text">
              <p
                style={{
                  color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
                }}
              >
                Non-exclusive Discord server for all 7.9 Billion Graymen to
                converse.
              </p>

              <div className="btn-buy-metamask">
                <button>
                  <img
                    className="metamask-logo"
                    src={Metamask}
                    alt="metamask-logo"
                  />
                  Join with NFT
                </button>
              </div>
            </div>
            <div className="join-pic">
              <img src={GreyMan} alt="community-img" />
            </div>
          </div> */}
        </div>
        <div className="wrapper">
          <p
            style={{
              color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
            }}
          >
            For Greymen Only
          </p>
          <div className="fgtm">
            <img src={GreyMan} alt="community-img" />
            <div className="dfds">
            <img
                    className="metamask-logo"
                    src={Metamask}
                    alt="metamask-logo"
                  />
            </div>
          </div>
        </div>
        <TeamMeet primaryColor={primaryColor} arraySplash={"greyman"} />
        <NotCommercial />
      </div>
    </div>
  );
};

export default SplashPage;
