import { memo } from 'react';
import './PersonalProfileMyNftTab.css';

const PersonalProfileMyNftTabComponent = ({
  filteredData,
  openModal,
  setSelectedData,
  defaultImg,
  primaryColor,
  chainData,
  textColor
}) => {
  return (
    <div className="gen">
      <div className="my-items-product-wrapper row">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => {
            return (
              <div
                onClick={() => {
                  openModal();
                  setSelectedData(item);
                }}
                key={index}
                className="col-2 my-item-element"
                style={{
                  backgroundImage: `url(${item.metadata.image || defaultImg})`,
                  backgroundColor: `var(--${primaryColor}-transparent)`
                }}>
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
                          {item.contract.slice(0, 5) +
                            '....' +
                            item.contract.slice(item.contract.length - 4)}
                        </small>
                        <div className="description-small" style={{}}>
                          <img
                            className="my-items-blockchain-img"
                            src={
                              item.blockchain
                                ? `${chainData[item?.blockchain]?.image}`
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
    </div>
  );
};

export const PersonalProfileMyNftTab = memo(PersonalProfileMyNftTabComponent);
