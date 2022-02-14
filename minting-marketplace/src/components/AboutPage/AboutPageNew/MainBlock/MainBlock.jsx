import React, { useState, useCallback, useEffect } from "react";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import { web3Switch } from "../../../../utils/switchBlockchain";
import Swal from "sweetalert2";
import { rFetch } from "../../../../utils/rFetch";
import { erc721Abi } from "../../../../contracts";
import { metamaskCall } from "../../../../utils/metamaskUtils";

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

const MainBlock = ({ Metamask, primaryColor }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState({ policy: false, use: false });

  const { minterInstance, contractCreator, currentUserAddress } = useSelector(
    (store) => store.contractStore
  );

  const switchToNetwork = "0x13881";
  const AboutPageTESTNET = "0x1bf2b3aB0014d2B2363dd999889d407792A28C06";

  let subtitle;

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  function afterOpenModal() {
    subtitle.style.color = "#9013FE";
  }
  function closeModal() {
    setIsOpen(false);
    setActive((prev) => ({
      ...prev,
      policy: false,
      use: false,
    }));
  }
  const buyTokenFromAboutPage = async () => {
    if (window.ethereum.chainId !== switchToNetwork) {
      web3Switch(switchToNetwork);
      return;
    }
    const { success, products } = await rFetch(
      `/api/contracts/network/${switchToNetwork}/${AboutPageTESTNET}/products/offers`
    );
    if (success) {
      let instance = contractCreator(AboutPageTESTNET, erc721Abi);
      let [aboutOffer] = products[0].offers.filter(
        (item) => item.offerName === "greyworld"
      );
      if (!aboutOffer) {
        Swal.fire("Error", "An error has ocurred", "error");
        return;
      }
      let nextToken = await instance.getNextSequentialIndex(
        0,
        aboutOffer.range[0],
        aboutOffer.range[1]
      );
      Swal.fire({
        title: "Please wait...",
        html: `Buying token #${nextToken.toString()}`,
        icon: "info",
        showConfirmButton: false,
      });
      if (
        await metamaskCall(
          minterInstance.buyToken(
            products[0].offerPool.marketplaceCatalogIndex,
            aboutOffer.offerIndex,
            nextToken,
            {
              value: aboutOffer.price,
            }
          )
        )
      ) {
        Swal.fire("Success", `Bought token #${nextToken}!`, "success");
      }
    }
  };

  return (
    <div className="information-author">
      <div className="home-about-desc">
        <h2
          style={{
            color: `${primaryColor === "rhyno" ? "#000" : "#fff"}`,
          }}
        >
          Encrypted,
          <br />
          Streaming NFTs
        </h2>
        <div
          className="autor-about-text"
          style={{
            color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}`,
          }}
        >
          Our platform makes it possible to attach digital goods
          <br />
          to an NFT using encrypted streaming - making today's
          <br />
          NFT multi-dimensional.
        </div>
        <div className="btn-buy-metamask">
          <button onClick={() => openModal()}>
            <img className="metamask-logo" src={Metamask} alt="metamask-logo" />{" "}
            Test our streaming
          </button>
        </div>
        <div className="modal__wrapper__about__page">
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
            <div className="modal-content-wrapper">
              <div className="modal-form">
                <form>
                  <div className="form-group">
                    <input type="checkbox" id="policy" />
                    <label
                      onClick={() =>
                        setActive((prev) => ({
                          ...prev,
                          policy: !prev.policy,
                        }))
                      }
                      htmlFor="policy"
                    >
                      I agree to the{" "}
                    </label>
                    <span
                      onClick={() => window.open("/privacy", "_blank")}
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
                    <label
                      onClick={() =>
                        setActive((prev) => ({ ...prev, use: !prev.use }))
                      }
                      htmlFor="use"
                    >
                      I accept the{" "}
                    </label>
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
                    I understand this is a prerelease NFT. Final artwork and
                    access to encrypted streams will be associated with your NFT
                    serial number at the time of launch.
                  </span>
                </div>
                <div className="modal-btn-wrapper">
                  <button
                    onClick={buyTokenFromAboutPage}
                    disabled={
                      currentUserAddress === undefined ||
                      !Object.values(active).every((el) => el)
                    }
                    className="modal-btn"
                  >
                    <img
                      style={{ width: "100px", marginLeft: "-1.5rem" }}
                      className="metamask-logo modal-btn-logo"
                      src={Metamask}
                      alt="metamask-logo"
                    />{" "}
                    {currentUserAddress ? "PURCHASE" : "Connect your wallet!"}
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default MainBlock;
