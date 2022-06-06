//@ts-nocheck
import React, { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import "./AuthenticityBlock.css";
import { TableAuthenticity } from "./AuthenticityBlockItems";

const AuthenticityBlock = ({
  tokenData,
  ownerInfo,
  selectedToken,
  title,
  collectionToken,
  selectedData
}) => {

  const { primaryColor } = useSelector(store => store.colorStore);

  const [authCollection, setAuthCollection] = useState(false);
  const [ipfsLink, setIpfsLink] = useState("");
  const defaultImg =
    "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW";

  const generateUrlColection = useCallback(() => {
    if (collectionToken) {
      let mass = collectionToken.split("/");
      if (mass.length > 0) {
        mass.pop();
        setAuthCollection(mass.join("/"));
      }
    } else {
      return false;
    }
  }, [collectionToken]);

  const initialIpfsLink = useCallback(() => {
    if (selectedData && selectedData.image) {
      setIpfsLink(selectedData.image);
    } else {
      setIpfsLink(defaultImg);
    }
  }, [selectedData]);

  useEffect(() => {
    generateUrlColection();
  }, [generateUrlColection]);

  useEffect(() => {
    initialIpfsLink();
  }, [initialIpfsLink]);

  return (
    <div className="block-authenticity">
      {title && <div className="authenticity-title">Authenticity</div>}
      <TableAuthenticity
        primaryColor={primaryColor}
        className="table-authenticity"
      >
        <div className="table-authenticity-title">Action</div>
        {tokenData && (
          <>
            {tokenData.map((el, index) => {
              if (Number(el.token) === Number(selectedToken) && el.authenticityLink !== "none") {
                return (
                  <div key={index} className="authenticity-box">
                    {
                      el.authenticityLink !== "none" && <a
                        className="nftDataPageTest-a-hover"
                        href={el.authenticityLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <div className="link-block">
                          <span>
                            <i className="fas fa-external-link-alt"></i>
                          </span>
                          Etherscan transaction
                        </div>
                        <div className="block-arrow">
                          <i className="fas fa-arrow-right"></i>
                        </div>
                      </a>
                    }
                  </div>
                );
              }
              return null;
            })}
          </>
        )}
        {authCollection && (
          <div className="authenticity-box">
            <a
              className="nftDataPageTest-a-hover"
              href={authCollection}
              target="_blank"
              rel="noreferrer"
            >
              <div className="link-block">
                <span>
                  <i className="fas fa-external-link-alt"></i>
                </span>
                Etherscan transaction
              </div>
              <div className="block-arrow">
                <i className="fas fa-arrow-right"></i>
              </div>
            </a>
          </div>
        )}
        <div className="authenticity-box">
          <a
            className="nftDataPageTest-a-hover"
            href={ipfsLink}
            target="_blank"
            rel="noreferrer"
          >
            <div className="link-block">
              <span>
                <i className="fas fa-external-link-alt"></i>
              </span>
              View on IPFS
            </div>
            <div className="block-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
          </a>
        </div>
      </TableAuthenticity>
    </div>
  );
};

export default AuthenticityBlock;
