import { memo, useEffect } from 'react';
import { CircularProgress } from '@mui/material';

import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import { ImageLazy } from '../../../MockUpPage/ImageLazy/ImageLazy';

import './PersonalProfileMyNftTab.css';

interface IPersonalProfileMyNftTabComponent {
  filteredData: any;
  openModal?: any;
  setSelectedData?: any;
  defaultImg: string;
  chainData: any;
  textColor: any;
  totalCount?: number | undefined;
  showTokensRef?: any;
  loader?: any;
  isLoading?: boolean;
  loadToken?: any;
  profile?: boolean;
}

const PersonalProfileMyNftTabComponent: React.FC<
  IPersonalProfileMyNftTabComponent
> = ({
  filteredData,
  openModal,
  setSelectedData,
  defaultImg,
  chainData,
  textColor,
  totalCount,
  showTokensRef,
  isLoading,
  loader,
  loadToken,
  profile
}) => {
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (loadToken) {
      const option = {
        root: null,
        rootMargin: '20px',
        threshold: 0
      };
      const observer = new IntersectionObserver(loadToken, option);
      if (loader.current) observer.observe(loader.current);
    }
  }, [loadToken, loader, isLoading]);

  return (
    <div className="gen">
      <div
        className={`my-items-product-wrapper ${
          (profile && 'row profile') ||
          (width >= 1250 && width <= 1400 && 'row')
        }`}>
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => {
            return (
              <div
                onClick={() => {
                  if (openModal && setSelectedData) {
                    openModal();
                    setSelectedData(item);
                  }
                }}
                key={index}
                className="col-2 my-item-element">
                <ImageLazy
                  className={`my-items-pict ${
                    profile && 'row profile'
                  } zoom-event`}
                  src={`${item.metadata.image || defaultImg}`}
                  alt={`My favorite NFT ${item.metadata.name}`}
                />
                <div className="w-100 bg-my-items">
                  <div className="col my-items-description-wrapper my-items-pic-description-wrapper">
                    <div
                      className="container-blue-description"
                      style={{ color: '#fff' }}>
                      <span className="description-title">
                        {item.metadata ? (
                          <>
                            <span>{item.title}</span>
                          </>
                        ) : (
                          <b> No metadata available </b>
                        )}
                        <br />
                      </span>
                      <div className="container-blockchain-info">
                        <small className="description">
                          {item.metadata && item.metadata.name.length > 16
                            ? item.metadata.name.slice(0, 5) +
                              '...' +
                              item.metadata.name.slice(
                                item.metadata.name.length - 4
                              )
                            : item.metadata.name}
                        </small>
                        <div className="description-small" style={{}}>
                          <img
                            className="my-items-blockchain-img"
                            src={
                              item.contract.blockchain
                                ? `${
                                    chainData[item.contract.blockchain]?.image
                                  }`
                                : ''
                            }
                            alt="Blockchain network"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ color: textColor, fontSize: '20px' }}>
            There is no such item with that name
          </p>
        )}
      </div>
      {loader && (
        <>
          {isLoading && (
            <div className="progress-token">
              <CircularProgress
                style={{
                  width: '70px',
                  height: '70px'
                }}
              />
            </div>
          )}
          {filteredData.length &&
            totalCount &&
            showTokensRef.current <= totalCount && (
              <div ref={loader} className="ref" />
            )}
        </>
      )}
    </div>
  );
};

export const PersonalProfileMyNftTab = memo(PersonalProfileMyNftTabComponent);
