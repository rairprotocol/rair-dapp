//unused-component  - new NftDataPageMain differs but for future I will keep this old version in project
import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel
} from 'react-accessible-accordion';
import ReactPlayer from 'react-player';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { utils } from 'ethers';

import { BreadcrumbsView } from '../components/MockUpPage/NftList/Breadcrumbs/Breadcrumbs';
import AuthenticityBlock from '../components/MockUpPage/NftList/NftData/AuthenticityBlock/AuthenticityBlock';
import CollectionInfo from '../components/MockUpPage/NftList/NftData/CollectionInfo/CollectionInfo';
import NftListUnlockablesVideos from '../components/MockUpPage/NftList/NftData/NftListUnlockablesVideos';
import TitleCollection from '../components/MockUpPage/NftList/NftData/TitleCollection/TitleCollection';
import { gettingPrice } from '../components/MockUpPage/NftList/utils/gettingPrice';
import ItemRank from '../components/MockUpPage/SelectBox/ItemRank';
import SelectNumber from '../components/MockUpPage/SelectBox/SelectNumber/SelectNumber';
import { RootState } from '../ducks';
import { ColorStoreType } from '../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../ducks/contracts/contracts.types';
// import CustomButton from '../components/MockUpPage/utils/button/CustomButton';
import { setShowSidebarTrue } from '../ducks/metadata/actions';
import useSwal from '../hooks/useSwal';
import useWeb3Tx from '../hooks/useWeb3Tx';
import chainData from '../utils/blockchainData';
import setDocumentTitle from '../utils/setTitle';

const NftDataPageMain = ({
  // setTokenData,
  blockchain,
  contract,
  currentUser,
  data,
  handleClickToken,
  product,
  productsFromOffer,
  selectedData,
  selectedToken,
  setSelectedToken,
  tokenData,
  totalCount,
  offerData,
  offerDataInfo,
  offerPrice,
  userData,
  someUsersData,
  ownerInfo
}) => {
  const { minterInstance } = useSelector<RootState, ContractsInitialType>(
    (state) => state.contractStore
  );
  const { primaryColor, textColor, primaryButtonColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);
  const [playing, setPlaying] = useState(false);
  const [offersIndexesData, setOffersIndexesData] = useState();

  const { web3TxHandler, correctBlockchain, web3Switch } = useWeb3Tx();
  const reactSwal = useSwal();

  const handlePlaying = () => {
    setPlaying((prev) => !prev);
  };
  const dispatch = useDispatch();

  function randomInteger(min, max) {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  function percentToRGB(percent) {
    if (percent) {
      if (percent < 15) {
        return '#95F619';
      } else if (15 <= percent && percent < 35) {
        return '#F6ED19';
      } else {
        return '#F63419';
      }
    }
  }

  function toUpper(string) {
    if (string) {
      return string[0].toUpperCase() + string.slice(1);
    }
  }

  function checkPrice() {
    if (offerPrice.length > 0) {
      const { maxPrice, minPrice } = gettingPrice(offerPrice);

      if (maxPrice === minPrice) {
        const samePrice = maxPrice;
        return `${samePrice} `;
      }
      return `${minPrice} – ${maxPrice}`;
    }
  }

  // function showLink() {
  //   //  checks if you are the owner and shows only to the owner

  //   // if (currentUser === tokenData[selectedToken]?.ownerAddress) {
  //   //   return (
  //   //     <div>
  //   //       {tokenData[selectedToken]?.authenticityLink !== "none" ? (
  //   //         <a href={tokenData[selectedToken]?.authenticityLink}>
  //   //           {tokenData[selectedToken]?.authenticityLink}
  //   //         </a>
  //   //       ) : (
  //   //         "Not minted yet"
  //   //       )}
  //   //     </div>
  //   //   );
  //   // } else {
  //   //   return <span>Not minted yet</span>;
  //   // }

  //   // shows everyone
  //   // v1
  //   // return (
  //   //   <div>
  //   //     {tokenData[selectedToken]?.authenticityLink ? (
  //   //       <a href={tokenData[selectedToken]?.authenticityLink}>
  //   //         {tokenData[selectedToken]?.authenticityLink}
  //   //       </a>
  //   //     ) : (
  //   //       "Not minted yet"
  //   //     )}
  //   //   </div>
  //   // );

  //   // v2
  //   // eslint-disable-next-line array-callback-return
  //   return tokenData.map((el, index) => {
  //     if (Number(el.token) === Number(selectedToken)) {
  //       return (
  //         <a
  //           className="nftDataPageTest-a-hover"
  //           key={index}
  //           href={el?.authenticityLink}
  //         >
  //           {el?.authenticityLink}
  //         </a>
  //       );
  //     }
  //     //   //  else {
  //     // return <span style={{cursor:"default"}}>Not minted yet</span>;
  //     //   // }
  //   });

  //   // if (tokenData[selectedToken]) {
  //   // eslint-disable-next-line array-callback-return
  //   //     return tokenData.map((el, index) => {
  //   //       if (Number(el.token) === Number(selectedToken)) {
  //   //         return (
  //   //           <a
  //   //             className="nftDataPageTest-a-hover"
  //   //             key={index}
  //   //             href={el?.authenticityLink}
  //   //           >
  //   //             {el?.authenticityLink}
  //   //           </a>
  //   //         );
  //   //       }
  //   //     });
  //   //   } else {
  //   //     return <span style={{ cursor: "default" }}>Not minted yet</span>;
  //   //   }
  // }

  const buyContract = async () => {
    reactSwal.fire({
      title: 'Buying token',
      html: 'Awaiting transaction completion',
      icon: 'info',
      showConfirmButton: false
    });
    if (!minterInstance) {
      return;
    }
    if (
      await web3TxHandler(
        minterInstance,
        'buyToken',
        [
          offerData.offerPool,
          offerData.offerIndex,
          selectedToken,
          {
            value: offerData.price
          }
        ],
        {
          intendedBlockchain: blockchain,
          failureMessage:
            'Sorry your transaction failed! When several people try to buy at once - only one transaction can get to the blockchain first. Please try again!'
        }
      )
    ) {
      reactSwal.fire(
        'Success',
        'Now, you are the owner of this token',
        'success'
      );
    }
  };

  function checkOwner() {
    const price = offerData?.price;
    // let price = offerData?.price || minPrice;
    if (
      currentUser === tokenData[selectedToken]?.ownerAddress &&
      tokenData[selectedToken]?.isMinted
    ) {
      return (
        <button
          className="nft-btn-sell"
          style={{
            color: `var(--${textColor})`
          }}>
          Sell
        </button>
      );
    } else if (tokenData[selectedToken]?.isMinted) {
      return (
        <button
          className="nft-btn-sell"
          disabled
          style={{
            color: `var(--${textColor})`
          }}>
          Already sold
        </button>
      );
    }
    return (
      <button
        className="btn rounded-rair rair-button nft-btn-stimorol"
        disabled={!offerData?.offerPool}
        style={{
          background: primaryButtonColor,
          color: textColor
        }}
        onClick={
          correctBlockchain(blockchain)
            ? buyContract
            : () => web3Switch(blockchain)
        }>
        Purchase •{' '}
        {utils
          .formatEther(price !== Infinity && price !== undefined ? price : 0)
          .toString()}{' '}
        {chainData[blockchain]?.symbol}
      </button>
    );
  }
  // function checkDataOfProperty() {
  //   if ( selectedData === 'object' && selectedData !== null) {
  //       if(selectedData.length){
  //       return selectedData?.attributes.map((item, index) => {
  //         if (item.trait_type === "External URL") {
  //           return (
  //             <div
  //               key={index}
  //               className="col-4 my-2 p-1 custom-desc-to-offer"
  //               style={{
  //                 color: textColor,
  //                 textAlign: "center",
  //               }}
  //             >
  //               <span>{item?.trait_type}:</span>
  //               <br />
  //               <a
  //                 style={{ color: textColor }}
  //                 href={item?.value}
  //               >
  //                 {item?.value}
  //               </a>
  //             </div>
  //           );
  //         }
  //         const percent = randomInteger(1, 40);
  //         return (
  //           <div
  //             key={index}
  //             className="col-4 my-2 p-1 custom-desc-to-offer"
  //           >
  //             <div className="custom-desc-item">
  //               <span>{item?.trait_type}:</span>
  //               <span style={{ color: textColor }}>
  //                 {item?.value}
  //               </span>
  //             </div>
  //             <div className="custom-offer-percents">
  //               <span
  //                 style={{
  //                   color: percentToRGB(percent),
  //                 }}
  //               >
  //                 {percent}%
  //               </span>
  //             </div>
  //           </div>
  //         );
  //       })
  //       }
  //   } else {
  //     if (Object.keys(selectedData).length) {
  //       return selectedData?.attributes.map((item, index) => {
  //         if (item.trait_type === "External URL") {
  //           return (
  //             <div
  //               key={index}
  //               className="col-4 my-2 p-1 custom-desc-to-offer"
  //               style={{
  //                 color: textColor,
  //                 textAlign: "center",
  //               }}
  //             >
  //               <span>{item?.trait_type}:</span>
  //               <br />
  //               <a style={{ color: textColor }} href={item?.value}>
  //                 {item?.value}
  //               </a>
  //             </div>
  //           );
  //         }
  //         const percent = randomInteger(1, 40);
  //         return (
  //           <div key={index} className="col-4 my-2 p-1 custom-desc-to-offer">
  //             <div className="custom-desc-item">
  //               <span>{item?.trait_type}:</span>
  //               <span style={{ color: textColor }}>{item?.value}</span>
  //             </div>
  //             <div className="custom-offer-percents">
  //               <span
  //                 style={{
  //                   color: percentToRGB(percent),
  //                 }}
  //               >
  //                 {percent}%
  //               </span>
  //             </div>
  //           </div>
  //         );
  //       });
  //     }
  //   }
  // }

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  useEffect(() => {
    setDocumentTitle('Single Token');
    dispatch(setShowSidebarTrue());
  }, [dispatch]);

  useEffect(() => {
    if (offerDataInfo !== undefined && offerDataInfo.length) {
      const first = offerDataInfo.map((r) => {
        return {
          copies: r.copies,
          soldCopies: r.soldCopies,
          offerIndex: r.offerIndex,
          range: r.range
        };
      });
      setOffersIndexesData(
        first.map((e, index) => {
          return {
            pkey:
              e.offerIndex === '0' ? (
                <FontAwesomeIcon icon={faKey} style={{ color: 'red' }} />
              ) : e.offerIndex === '1' ? (
                '🔑'
              ) : (
                <FontAwesomeIcon icon={faKey} style={{ color: 'silver' }} />
              ),
            value:
              e.offerIndex === '0'
                ? 'Ultra Rair'
                : e.offerIndex === '1'
                  ? 'Rair'
                  : 'Common',
            id: index,
            copies: e.copies,
            soldCopies: e.soldCopies,
            range: e.range
          };
        })
      );
    }
  }, [offerDataInfo]);

  return (
    <div id="nft-data-page-wrapper">
      <BreadcrumbsView />
      <div>
        <TitleCollection
          selectedData={selectedData}
          title={selectedData?.name}
          someUsersData={someUsersData}
          userName={ownerInfo?.owner}
          currentUser={userData}
        />
        <div className="nft-data-content">
          <div
            className="nft-collection"
            style={{
              background: `${
                primaryColor === 'rhyno' ? 'rgb(191 191 191)' : '#383637'
              }`
            }}>
            {selectedData?.animation_url ? (
              <div className="single-token-block-video">
                <ReactPlayer
                  width={'100%'}
                  height={'auto'}
                  controls
                  playing={playing}
                  onReady={handlePlaying}
                  url={selectedData?.animation_url}
                  light={
                    selectedData.image
                      ? selectedData?.image
                      : `${
                          import.meta.env.VITE_IPFS_GATEWAY
                        }/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW`
                  }
                  loop={false}
                  onEnded={handlePlaying}
                />
              </div>
            ) : (
              <div
                className="single-token-block-img"
                style={{
                  backgroundImage: `url(${
                    selectedData?.image
                      ? selectedData.image
                      : `${
                          import.meta.env.VITE_IPFS_GATEWAY
                        }/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW`
                  })`
                }}></div>
            )}
          </div>
          <div className="main-tab">
            <div>
              <div className="collection-label-name">Price range</div>
              <div className="nft-single-price-range">
                <img
                  style={{ width: '24px', transform: 'scale(1.2)' }}
                  src={`${
                    data
                      ? chainData[data?.contract.blockchain]?.image
                      : chainData[blockchain]?.image
                  }`}
                  alt="Blockchain network"
                />
                <span
                  style={{
                    paddingLeft: '9px',
                    // marginRight: "3rem",
                    fontSize: '13px'
                  }}>
                  {offerPrice && `${checkPrice()}`}
                </span>
                <span
                  style={{
                    color: '#E882D5'
                  }}>
                  {data
                    ? chainData[data?.contract.blockchain]?.symbol
                    : chainData[blockchain]?.symbol}
                </span>
              </div>
            </div>
            <div>
              <div className="collection-label-name">Item rank</div>
              <div>
                <ItemRank
                  primaryColor={primaryColor}
                  items={offersIndexesData}
                  selectedToken={selectedToken}
                />
              </div>
            </div>
            <div>
              <div className="collection-label-name">Serial number</div>
              <div>
                {tokenData.length ? (
                  <SelectNumber
                    blockchain={blockchain}
                    product={product}
                    contract={contract}
                    totalCount={totalCount}
                    handleClickToken={handleClickToken}
                    selectedToken={selectedToken}
                    setSelectedToken={setSelectedToken}
                    items={
                      tokenData &&
                      tokenData.map((p) => {
                        return {
                          value: p.metadata.name,
                          id: p._id,
                          token: p.token,
                          sold: p.isMinted
                        };
                      })
                    }
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div
              style={{
                marginTop: '18px'
              }}>
              {checkOwner()}
            </div>
          </div>
          <Accordion
            allowMultipleExpanded
            preExpanded={['a']} /* allowZeroExpanded allowMultipleExpanded*/
          >
            <AccordionItem uuid="a">
              <AccordionItemHeading>
                <AccordionItemButton>Description</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                {selectedData?.artist === 'none' &&
                selectedData?.description === 'none' &&
                selectedData?.external_url === 'none' ? (
                  <div
                    className=" custom-desc-to-offer-wrapper"
                    style={{ color: '#A7A6A6', textAlign: 'left' }}>
                    {/* <div className="my-2 px-4 custom-desc-to-offer"> */}
                    <span>Created by </span>
                    <strong>
                      {someUsersData !== null
                        ? someUsersData?.nickName
                        : ownerInfo?.owner}
                    </strong>
                    {/* </div> */}
                  </div>
                ) : (
                  <div className=" custom-desc-to-offer-wrapper">
                    {/* <div className="my-2 px-4 custom-desc-to-offer"> */}
                    <p style={{ color: '#A7A6A6', textAlign: 'left' }}>
                      {/* {selectedData?.artist? `${toUpper(selectedData?.artist)}#` :'' }  */}
                      {selectedData?.description}
                    </p>
                    {/* </div> */}
                    {/* <div className="my-2 px-4 custom-desc-to-offer"> */}
                    {/* </div> */}
                    {/* <div className="my-2 px-4 custom-desc-to-offer"> */}
                    {/* <a
                        target="_blank"
                        rel="noreferrer"
                        href={selectedData?.external_url}
                      >
                        {selectedData?.external_url}
                      </a> */}
                    {/* </div> */}
                  </div>
                )}
              </AccordionItemPanel>
            </AccordionItem>

            <AccordionItem uuid="b">
              <AccordionItemHeading>
                <AccordionItemButton>Properties</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <div className="col-12 row mx-0 box--properties">
                  {/* {checkDataOfProperty()} */}
                  {selectedData ? (
                    Object.keys(selectedData).length &&
                    // ? selectedData.length &&
                    selectedData?.attributes.length > 0 ? (
                      selectedData?.attributes.map((item, index) => {
                        if (
                          item.trait_type === 'External URL' ||
                          item.trait_type === 'external_url'
                        ) {
                          return null;
                          // <div
                          //   key={index}
                          //   className="col-4 my-2 p-1 custom-desc-to-offer"
                          //   style={{
                          //     cursor: "default",
                          //     color: textColor,
                          //     textAlign: "center",
                          //   }}
                          // >
                          //   <span>{item?.trait_type}:</span>
                          //   <br />
                          //   <a
                          //     className="custom-offer-pic-link"
                          //     style={{ color: textColor }}
                          //     href={item?.value}
                          //   >
                          //     {item?.value.length > 15 ? "..." : ""}
                          //     {item?.value.slice(
                          //       item?.value.indexOf("\n") + 19
                          //     )}
                          //   </a>
                          // </div>
                        }
                        if (
                          item.trait_type === 'image' ||
                          item.trait_type === 'animation_url'
                        ) {
                          return (
                            <div
                              key={index}
                              className="col-1 m-1 p-1 px-4 custom-desc-to-offer"
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                color: textColor,
                                textAlign: 'center'
                              }}>
                              <span>
                                {' '}
                                <a
                                  className="custom-offer-pic-link"
                                  style={{
                                    color: textColor
                                  }}
                                  target="_blank"
                                  rel="noreferrer"
                                  href={item?.value}>
                                  {toUpper(item?.trait_type)}
                                </a>
                              </span>
                            </div>
                          );
                        }
                        const percent = randomInteger(1, 40);
                        return (
                          <div
                            key={index}
                            className="col-1 m-1 p-1 custom-desc-to-offer d-flex flex-column justify-content-center"
                            style={{ width: '157px' }}>
                            <div className="custom-desc-item">
                              <span
                                className="rtl-overlow-elipsis"
                                title={toUpper(
                                  item?.trait_type.toString().toLowerCase()
                                )}>
                                {`${item?.trait_type.toUpperCase()} `}
                              </span>
                            </div>
                            <div className="custom-offer-percents">
                              {/* <span className="rtl-overlow-elipsis" title={toUpper(item?.value.toString().toLowerCase())} */}
                              {/* > */}
                              {/* <span className="rtl-overlow-elipsis">  */}
                              <span
                                className="text-bold rtl-overlow-elipsis"
                                title={toUpper(
                                  item?.value.toString().toLowerCase()
                                )}>
                                <span
                                  style={{
                                    color: percentToRGB(percent),
                                    fontSize: '12px'
                                  }}>
                                  {percent}%
                                </span>
                                :
                                {`${toUpper(
                                  item?.value.toString().toLowerCase()
                                )} `}
                              </span>

                              {/* </span> */}
                              {/* </span> */}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div>{"You don't have any properties"}</div>
                    )
                  ) : null}
                </div>
              </AccordionItemPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>This NFT unlocks</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <NftListUnlockablesVideos
                  productsFromOffer={productsFromOffer}
                  selectedData={selectedData}
                />
                {/* {productsFromOffer && productsFromOffer.length !== 0 ? (
                  <CustomButton
                    onClick={() =>
                      navigate(
                        `/unlockables/${blockchain}/${contract}/${product}/${selectedToken}`
                      )
                    }
                    text="More Unlockables"
                    width="288px"
                    height="48px"
                    textColor={textColor}
                    primaryColor={primaryColor}
                    margin={'0 auto'}
                  />
                ) : null} */}
              </AccordionItemPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>Collection info</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <CollectionInfo
                  openTitle={true}
                  offerData={offerDataInfo}
                  blockchain={blockchain}
                />
              </AccordionItemPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>Authenticity</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                {/* <div>{showLink()}</div> */}
                <AuthenticityBlock
                  title={false}
                  collectionToken={'Test'}
                  tokenData={tokenData}
                  selectedToken={selectedToken}
                  selectedData={selectedData}
                />
              </AccordionItemPanel>
            </AccordionItem>
          </Accordion>
        </div>
        <div style={{ maxWidth: '1200px', margin: 'auto' }}>
          {/* <span style={{}}>More by {tokenData[selectedToken]?.ownerAddress ? tokenData[selectedToken]?.ownerAddress : "User" }</span> */}
        </div>
      </div>
    </div>
  );
};

export default NftDataPageMain;
