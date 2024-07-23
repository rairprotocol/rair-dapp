import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState } from '../../../../ducks';
import { ColorStoreType } from '../../../../ducks/colors/colorStore.types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
// import NftDifferentRarity from "./UnlockablesPage/NftDifferentRarity/NftDifferentRarity";

const NftListUnlockablesVideos = ({
  // blockchain,
  // contract,
  // product,
  productsFromOffer,
  selectedData
  // selectedToken,
}) => {
  const navigate = useNavigate();

  const partOfVideo = productsFromOffer?.length
    ? productsFromOffer.slice(0, 2)
    : 0;

  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  return (
    <div className="nftlist-unlockable-videos">
      {/* <NftDifferentRarity productsFromOffer={productsFromOffer} /> */}
      {(partOfVideo?.length &&
        partOfVideo.map((v) => {
          // console.log(v.offer[0], "rarity");
          return (
            <div
              key={v._id}
              style={{
                margin: '1rem',
                height: '135px'
              }}>
              <div
                className="nft-unlockable-videoItem"
                onClick={() => navigate(`/watch/${v._id}/${v.mainManifest}`)}
                style={{
                  backgroundColor: `${
                    primaryColor === 'rhyno'
                      ? 'rgb(167, 166, 166)'
                      : '#4E4D4DCC'
                  }`
                }}>
                <div
                  style={{
                    position: 'relative'
                  }}>
                  <div className="nft-unlockable-imgContent">
                    <FontAwesomeIcon
                      style={{
                        paddingLeft: '1px',
                        paddingTop: '8px'
                      }}
                      icon={faLock}
                    />
                    <p
                      style={{
                        textAlign: 'center',
                        marginLeft: '-2rem',
                        marginTop: '9px',
                        width: 'max-content',
                        wordBreak: 'break-all'
                      }}>
                      {v.description}
                    </p>
                  </div>
                  {/* {productsFromOffer.length && productsFromOffer.map((v) => {return } )} */}
                  <img
                    style={{
                      filter: `${
                        primaryColor === 'rhyno' ? 'blur(1px)' : 'blur(3px)'
                      }`
                    }}
                    src={`${v?.staticThumbnail}`}
                    // src={selectedData?.image}
                    alt="Preview unlockable video"
                  />
                </div>
                <div
                  className="nft-unlockable-contentItem"
                  style={{
                    borderLeft: '4px solid #CCA541',
                    display: 'flex',
                    flexDirection: 'column',
                    width: 'inher',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    paddingLeft: '24px'
                  }}>
                  <div>
                    {' '}
                    <p>{v?.title}</p>{' '}
                  </div>
                  <div>
                    <p style={{ color: textColor }}>{v?.duration}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })) || (
        <div
          style={{
            margin: '1rem',
            height: '135px'
          }}>
          <div
            className="nft-unlockable-videoItem"
            onClick={
              () => console.info('Coming soon')
              // navigate(
              //   `/watch/${productsFromOffer._id}/${productsFromOffer.mainManifest}`
              // )
            }
            style={{
              backgroundColor: `${
                primaryColor === 'rhyno' ? 'rgb(167, 166, 166)' : '#4E4D4DCC'
              }`
            }}>
            <div
              style={{
                position: 'relative'
              }}>
              <div className="nft-unlockable-imgContent">
                <FontAwesomeIcon
                  style={{
                    paddingLeft: '1px',
                    paddingTop: '8px'
                  }}
                  icon={faLock}
                />
                <p
                  style={{
                    textAlign: 'center',
                    marginLeft: '-2rem',
                    marginTop: '9px',
                    width: 'max-content'
                  }}>
                  Coming soon
                </p>
              </div>
              {/* {productsFromOffer.length && productsFromOffer.map((v) => {return } )} */}
              <img
                style={{
                  filter: 'blur(3px)'
                }}
                // src={`/thumbnails/${v?.thumbnail}.png`}
                src={selectedData?.image}
                alt="Preview unlockable video"
              />
            </div>
            <div
              className="nft-unlockable-contentItem"
              style={{
                borderLeft: '4px solid #CCA541',
                display: 'flex',
                flexDirection: 'column',
                width: 'inher',
                justifyContent: 'center',
                alignItems: 'flex-start',
                paddingLeft: '24px'
              }}>
              <div>
                {' '}
                <p>
                  {/* {v?.title} */}
                  Video {selectedData?.name}
                </p>{' '}
              </div>
              <div>
                <p
                  style={{
                    color: `${primaryColor === 'rhyno' ? 'black' : '#A7A6A6'}`
                  }}>
                  00:00:00
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NftListUnlockablesVideos;
