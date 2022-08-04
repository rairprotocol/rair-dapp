//@ts-nocheck
import React, { useEffect, useState } from 'react';
import NftDifferentRarity from './UnlockablesPage/NftDifferentRarity/NftDifferentRarity';
import './NftSingleUnlockables.css';

const NftSingleUnlockables = ({
  productsFromOffer,
  setTokenDataFiltered,
  primaryColor,
  setSelectVideo
}) => {
  const [sections, setSections] = useState(null);
  const [rarity, setRarity] = useState([
    'Unlock Ultra Rair',
    'Unlock Rair',
    'Unlock Common'
  ]);

  useEffect(() => {
    const ope = productsFromOffer.some((i) => i.isUnlocked === true);
    if (ope) {
      setRarity(['Ultra Rair', 'Rair', 'Common']);
    }
  }, [productsFromOffer]);

  useEffect(() => {
    const result = productsFromOffer.reduce((acc, item) => {
      const key = item.offer[0];
      const value = acc[key];

      if (value) {
        acc[key] = [...value, item];
      } else {
        acc[key] = [item];
      }
      return acc;
    }, {});
    setSections(result);
  }, [productsFromOffer]);

  return (
    <div className="nft-single-unlockables-page">
      {sections &&
        Object.entries(sections).map(([key, item]) => {
          return (
            <div className="nft-rarity-wrapper" key={key}>
              <NftDifferentRarity
                setTokenDataFiltered={setTokenDataFiltered}
                title={rarity[key]}
                isUnlocked={item.map((i) => i.isUnlocked)}
              />
              <div className="video-wrapper">
                {item.map((v) => {
                  return (
                    <div
                      key={v._id}
                      style={{
                        marginBottom: '16px'
                      }}>
                      <div
                        onClick={() => setSelectVideo(v)}
                        className="video-box-rarity"
                        style={{
                          backgroundColor: `${
                            primaryColor === 'rhyno' ? '#F2F2F2' : '#4E4D4DCC'
                          }`
                        }}>
                        {v.isUnlocked ? (
                          <div
                            className="block-rariry-unlock-video"
                            style={{
                              position: 'relative'
                            }}>
                            <img src={`${v?.staticThumbnail}`} alt="" />
                          </div>
                        ) : (
                          <div className="block-rariry-unlock-video lock">
                            <div className="custom-lock">
                              <i className="fa fa-lock" aria-hidden="true"></i>
                              <p
                                className={`video-rarity-preview-text ${
                                  v.description.length > 20 ? 'long' : ''
                                } ${primaryColor === 'rhyno' ? 'rhyno' : ''}`}>
                                {v.description}
                              </p>
                            </div>
                            <img src={`${v?.staticThumbnail}`} alt="" />
                          </div>
                        )}
                        <div
                          className={`nft-unlokvideo-description ${
                            primaryColor === 'rhyno' ? 'rhyno' : ''
                          }`}>
                          <div>
                            {' '}
                            <p>{v?.title}</p>{' '}
                          </div>
                          <div>
                            <p>{v?.duration}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default NftSingleUnlockables;
