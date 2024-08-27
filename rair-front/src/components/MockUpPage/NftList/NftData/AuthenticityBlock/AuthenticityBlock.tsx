import React, { useState } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import {
  faArrowRight,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TableAuthenticity } from './AuthenticityBlockItems';

import { useAppSelector } from '../../../../../hooks/useReduxHooks';
import { defaultHotDrops } from '../../../../../images';
import { IAuthenticityBlock } from '../../nftList.types';

import './AuthenticityBlock.css';

const AuthenticityBlock: React.FC<IAuthenticityBlock> = ({
  tokenData,
  selectedToken,
  title,
  collectionToken,
  selectedData
}) => {
  const { primaryColor, textColor, isDarkMode } = useAppSelector(
    (store) => store.colors
  );

  const hotdropsVar = import.meta.env.VITE_TESTNET;

  const [authCollection, setAuthCollection] = useState<string>();
  const [ipfsLink, setIpfsLink] = useState<string>('');
  const defaultImg =
    hotdropsVar === 'true'
      ? defaultHotDrops
      : `${
          import.meta.env.VITE_IPFS_GATEWAY
        }/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW`;

  const generateUrlColection = useCallback(() => {
    if (collectionToken) {
      const mass = collectionToken.split('/');
      if (mass.length > 0) {
        mass.pop();
        setAuthCollection(mass.join('/'));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        isDarkMode={isDarkMode}
        className="table-authenticity">
        <div className="table-authenticity-title">Action</div>
        {tokenData && (
          <>
            {Object.keys(tokenData).map((index: string) => {
              const el = tokenData[index];
              if (index === selectedToken && el.authenticityLink !== 'none') {
                return (
                  <div key={index} className="authenticity-box">
                    {el.authenticityLink !== 'none' && (
                      <a
                        className="nftDataPageTest-a-hover"
                        href={el.authenticityLink}
                        target="_blank"
                        rel="noreferrer">
                        <div className="link-block">
                          <span>
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                          </span>
                          Etherscan transaction
                        </div>
                        <div className={`block-arrow`}>
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            style={{
                              color:
                                import.meta.env.VITE_TESTNET === 'true'
                                  ? `${
                                      textColor === '#FFF' ||
                                      textColor === 'black'
                                        ? '#F95631'
                                        : textColor
                                    }`
                                  : `${
                                      textColor === '#FFF' ||
                                      textColor === 'black'
                                        ? '#E882D5'
                                        : textColor
                                    }`
                            }}
                          />
                        </div>
                      </a>
                    )}
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
              rel="noreferrer">
              <div className="link-block">
                <span>
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                </span>
                Etherscan transaction
              </div>
              <div className="block-arrow">
                <FontAwesomeIcon
                  icon={faArrowRight}
                  style={{
                    color:
                      import.meta.env.VITE_TESTNET === 'true'
                        ? `${
                            textColor === '#FFF' || textColor === 'black'
                              ? '#F95631'
                              : textColor
                          }`
                        : `${
                            textColor === '#FFF' || textColor === 'black'
                              ? '#E882D5'
                              : textColor
                          }`
                  }}
                />
              </div>
            </a>
          </div>
        )}
        <div className="authenticity-box">
          <a
            className="nftDataPageTest-a-hover"
            href={ipfsLink}
            target="_blank"
            rel="noreferrer">
            <div className="link-block">
              <span>
                <FontAwesomeIcon icon={faExternalLinkAlt} />
              </span>
              View on IPFS
            </div>
            <div
              className={`block-arrow ${
                hotdropsVar === 'true' ? 'hotdrops-color' : ''
              }`}>
              <FontAwesomeIcon
                icon={faArrowRight}
                style={{
                  color:
                    import.meta.env.VITE_TESTNET === 'true'
                      ? `${
                          textColor === '#FFF' || textColor === 'black'
                            ? '#F95631'
                            : textColor
                        }`
                      : `${
                          textColor === '#FFF' || textColor === 'black'
                            ? '#E882D5'
                            : textColor
                        }`
                }}
              />
            </div>
          </a>
        </div>
      </TableAuthenticity>
    </div>
  );
};

export default AuthenticityBlock;
