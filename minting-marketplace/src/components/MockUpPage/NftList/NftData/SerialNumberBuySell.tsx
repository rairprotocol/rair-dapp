import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import { BuySellButton } from './BuySellButton';
import SellInputButton from './SellInputButton';

import { RootState } from '../../../../ducks';
import { ContractsInitialType } from '../../../../ducks/contracts/contracts.types';
import chainData from '../../../../utils/blockchainData';
import { CheckEthereumChain } from '../../../../utils/CheckEthereumChain';
import { metamaskCall } from '../../../../utils/metamaskUtils';
import { rFetch } from '../../../../utils/rFetch';
import { ContractType } from '../../../adminViews/adminView.types';
import { ISerialNumberBuySell } from '../../mockupPage.types';
import SelectNumber from '../../SelectBox/SelectNumber/SelectNumber';
import { currentTokenData } from '../utils/currentTokenData';

const SerialNumberBuySell: React.FC<ISerialNumberBuySell> = ({
  tokenData,
  handleClickToken,
  blockchain,
  product,
  contract,
  totalCount,
  selectedToken,
  setSelectedToken,
  primaryColor,
  offerData,
  currentUser,
  loginDone,
  handleTokenBoughtButton
}) => {
  const { minterInstance, diamondMarketplaceInstance, currentChain } =
    useSelector<RootState, ContractsInitialType>(
      (state) => state.contractStore
    );
  const currentProvider = window.ethereum.chainId;
  const [contractData, setContractData] = useState<ContractType>();

  const realChainProtected = currentChain || currentProvider;

  const disableBuyBtn = useCallback(() => {
    // Returns true to DISABLE the button
    // Returs false to ENABLE the button
    if (!contractData || !offerData?.offerIndex) {
      return true;
    } else if (contractData.diamond) {
      return !offerData.diamondRangeIndex;
    } else {
      return !offerData.offerPool;
    }
  }, [offerData, contractData]);

  const buyContract = useCallback(async () => {
    if (
      !contractData ||
      !offerData ||
      !diamondMarketplaceInstance ||
      !minterInstance
    ) {
      return;
    }
    Swal.fire({
      title: 'Buying token',
      html: 'Awaiting transaction completion',
      icon: 'info',
      showConfirmButton: false
    });
    let marketplaceCall, marketplaceArguments;
    if (contractData.diamond) {
      marketplaceCall = diamondMarketplaceInstance?.buyMintingOffer;
      marketplaceArguments = [
        offerData.offerIndex, // Offer Index
        selectedToken // Token Index
      ];
    } else {
      marketplaceCall = minterInstance?.buyToken;
      marketplaceArguments = [
        offerData?.offerPool, // Catalog Index
        offerData?.offerIndex, // Range Index
        selectedToken // Internal Token Index
      ];
    }
    marketplaceArguments.push({ value: offerData.price });
    if (
      await metamaskCall(
        marketplaceCall(...marketplaceArguments),
        'Sorry your transaction failed! When several people try to buy at once - only one transaction can get to the blockchain first. Please try again!',
        handleTokenBoughtButton
      )
    ) {
      Swal.fire('Success', 'Now, you are the owner of this token', 'success');
    }
  }, [
    minterInstance,
    offerData,
    diamondMarketplaceInstance,
    contractData,
    selectedToken,
    handleTokenBoughtButton
  ]);

  useEffect(() => {
    if (offerData) {
      (async () => {
        const contractInfo = await rFetch(
          `/api/v2/contracts/${offerData.contract}`
        );
        setContractData(contractInfo?.contract);
      })();
    }
  }, [offerData]);

  const checkOwner = useCallback(() => {
    const price = offerData?.price;
    const handleBuyButton = () => {
      return realChainProtected === blockchain
        ? buyContract
        : () => {
            CheckEthereumChain(blockchain);
            // buyContract();
          };
    };
    return offerData && offerData.price ? (
      <BuySellButton
        handleClick={handleBuyButton()}
        disabled={disableBuyBtn()}
        isColorPurple={true}
        title={`Buy .${(price && +price !== Infinity && price !== undefined
          ? price
          : 0
        ).toString()}
            ${blockchain && chainData[blockchain]?.symbol}`}
      />
    ) : (
      <p></p>
    );
  }, [offerData, disableBuyBtn, blockchain, realChainProtected, buyContract]);

  const checkAllSteps = useCallback(() => {
    if (blockchain !== realChainProtected) {
      return loginDone ? (
        <BuySellButton
          handleClick={() => CheckEthereumChain(blockchain)}
          isColorPurple={true}
          title={`Switch network`}
        />
      ) : (
        checkOwner()
      );
    } else if (selectedToken && !tokenData?.[selectedToken]?.isMinted) {
      return checkOwner();
    } else {
      return (
        <SellInputButton
          currentUser={currentUser}
          tokenData={tokenData}
          selectedToken={selectedToken}
        />
      );
    }
  }, [
    blockchain,
    checkOwner,
    realChainProtected,
    currentUser,
    selectedToken,
    tokenData,
    loginDone
  ]);

  return (
    <div className="main-tab">
      <div className="main-tab-description-serial-number">
        <div
          className="description-text serial-number-text"
          style={{
            color: `${primaryColor === 'rhyno' ? '#7A797A' : '#A7A6A6'}`
          }}>
          Serial number
        </div>
        <div>
          {tokenData?.length ? (
            <SelectNumber
              blockchain={blockchain}
              product={product}
              contract={contract}
              totalCount={totalCount}
              handleClickToken={handleClickToken}
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken}
              items={currentTokenData(tokenData)}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div>{checkAllSteps()}</div>
    </div>
  );
};

export default SerialNumberBuySell;

// ======= New part of buy tokens =======
// /* eslint-disable no-debugger */
// /* eslint-disable no-console */
// //@ts-nocheck

// import React, { useCallback, useState, useEffect } from 'react';
// import { ISerialNumberBuySell } from '../../mockupPage.types';
// import { CheckEthereumChain } from '../../../../utils/CheckEthereumChain';
// import { BuySellButton } from './BuySellButton';
// import { metamaskCall } from '../../../../utils/metamaskUtils';
// import { RootState } from '../../../../ducks';
// import { ContractsInitialType } from '../../../../ducks/contracts/contracts.types';
// import { useSelector } from 'react-redux';
// import SelectNumber from '../../SelectBox/SelectNumber/SelectNumber';
// import chainData from '../../../../utils/blockchainData';
// import Swal from 'sweetalert2';
// import SellInputButton from './SellInputButton';

// const SerialNumberBuySell: React.FC<ISerialNumberBuySell> = ({
//   tokenData,
//   handleClickToken,
//   blockchain,
//   product,
//   contract,
//   totalCount,
//   selectedToken,
//   setSelectedToken,
//   primaryColor,
//   offerData,
//   currentUser,
//   loginDone
// }) => {
//   const { minterInstance, currentChain, diamondMarketplaceInstance } =
//     useSelector<RootState, ContractsInitialType>(
//       (state) => state.contractStore
//     );

//   const currentProvider = window.ethereum.chainId;
//   const realChainProtected = currentChain || currentProvider;

//   // const [offersArray, setOffersArray] = useState([]);

//   const fetchDiamondData = useCallback(async () => {
//     if (!diamondMarketplaceInstance) {
//       return;
//     }
//     const offerCount = Number(
//       (await diamondMarketplaceInstance.getTotalOfferCount()).toString()
//     );
//     const offerData = [];
//     for (let i = 0; i < offerCount; i++) {
//       const singleOfferData = await diamondMarketplaceInstance.getOfferInfo(i);
//       offerData.push({
//         offerIndex: i,
//         contractAddress: singleOfferData.mintOffer.erc721Address,
//         rangeIndex: singleOfferData.mintOffer.rangeIndex.toString(),
//         visible: singleOfferData.mintOffer.visible,
//         startingToken: singleOfferData.rangeData.rangeStart.toString(),
//         endingToken: singleOfferData.rangeData.rangeEnd.toString(),
//         name: singleOfferData.rangeData.rangeName,
//         price: singleOfferData.rangeData.rangePrice,
//         tokensAllowed: singleOfferData.rangeData.tokensAllowed.toString(),
//         mintableTokens: singleOfferData.rangeData.mintableTokens.toString(),
//         lockedTokens: singleOfferData.rangeData.lockedTokens.toString(),
//         productIndex: singleOfferData.productIndex.toString()
//       });
//     }
//     // setOffersArray(offerData);
//   }, [diamondMarketplaceInstance]);

//   useEffect(() => {
//     if (diamondMarketplaceInstance) {
//       diamondMarketplaceInstance.on('MintedToken', fetchDiamondData);
//       return () =>
//         diamondMarketplaceInstance.off('MintedToken', fetchDiamondData);
//     }
//   }, [diamondMarketplaceInstance, fetchDiamondData]);

//   const mintTokenCall = useCallback(
//     async (offerIndex, nextToken, price) => {
//       Swal.fire({
//         title: `Buying token #${nextToken}!`,
//         html: 'Please wait...',
//         icon: 'info',
//         showConfirmButton: false
//       });
//       if (
//         await metamaskCall(
//           diamondMarketplaceInstance.buyMintingOffer(offerIndex, nextToken, {
//             value: price
//           })
//         )
//       ) {
//         Swal.fire({
//           title: 'Success',
//           html: 'Token bought',
//           icon: 'success',
//           showConfirmButton: true
//         });
//       }
//     },
//     [diamondMarketplaceInstance]
//   );

//   const disableBuyBtn = useCallback(() => {
//     if (!offerData.diamondRangeIndex) {
//       return false;
//     } else if (!offerData?.offerPool) {
//       return false;
//     } else {
//       return true;
//     }
//   }, [offerData]);

//   const buyContract = useCallback(async () => {
//     Swal.fire({
//       title: 'Buying token',
//       html: 'Awaiting transaction completion',
//       icon: 'info',
//       showConfirmButton: false
//     });
//     if (offerData) {
//       if (offerData.diamondRangeIndex) {
//         await mintTokenCall?.(
//           +offerData.diamondRangeIndex,
//           +selectedToken,
//           +offerData.price
//         );
//       } else {
//         debugger;
//         if (
//           await metamaskCall(
//             minterInstance?.buyToken(
//               offerData.offerPool,
//               offerData.offerIndex,
//               selectedToken,
//               {
//                 value: offerData.price
//               }
//             ),
//             'Sorry your transaction failed! When several people try to buy at once - only one transaction can get to the blockchain first. Please try again!'
//           )
//         ) {
//           Swal.fire(
//             'Success',
//             'Now, you are the owner of this token',
//             'success'
//           );
//         }
//       }
//     }
//   }, [mintTokenCall, minterInstance, offerData, selectedToken]);

//   const checkOwner = useCallback(() => {
//     const price = offerData?.price;
//     const handleBuyButton = () => {
//       return realChainProtected === blockchain
//         ? buyContract
//         : () => {
//             CheckEthereumChain(blockchain);
//             // buyContract();
//           };
//     };
//     return offerData && offerData.price ? (
//       <BuySellButton
//         handleClick={handleBuyButton()}
//         disabled={disableBuyBtn()}
//         isColorPurple={true}
//         title={`Buy .${(+price !== Infinity && price !== undefined
//           ? price
//           : 0
//         ).toString()}
//             ${blockchain && chainData[blockchain]?.symbol}`}
//       />
//     ) : (
//       <p>no data</p>
//     );
//   }, [offerData, disableBuyBtn, blockchain, realChainProtected, buyContract]);

//   const checkAllSteps = useCallback(() => {
//     if (blockchain !== realChainProtected) {
//       return loginDone ? (
//         <BuySellButton
//           handleClick={() => CheckEthereumChain(blockchain)}
//           isColorPurple={true}
//           title={`Switch network`}
//         />
//       ) : (
//         checkOwner()
//       );
//     } else if (!tokenData[selectedToken]?.isMinted) {
//       return checkOwner();
//     } else {
//       return (
//         <SellInputButton
//           currentUser={currentUser}
//           tokenData={tokenData}
//           selectedToken={selectedToken}
//         />
//       );
//     }
//   }, [
//     blockchain,
//     checkOwner,
//     realChainProtected,
//     currentUser,
//     selectedToken,
//     tokenData,
//     loginDone
//   ]);

//   return (
//     <div className="main-tab">
//       <div className="main-tab-description-serial-number">
//         <div
//           className="description-text serial-number-text"
//           style={{
//             color: `${primaryColor === 'rhyno' ? '#7A797A' : '#A7A6A6'}`
//           }}>
//           Serial number
//         </div>
//         <div>
//           {tokenData.length ? (
//             <SelectNumber
//               blockchain={blockchain}
//               product={product}
//               contract={contract}
//               totalCount={totalCount}
//               handleClickToken={handleClickToken}
//               selectedToken={selectedToken}
//               setSelectedToken={setSelectedToken}
//               items={
//                 tokenData &&
//                 tokenData.map((p) => {
//                   return {
//                     value: p.metadata.name,
//                     id: p._id,
//                     token: p.token,
//                     sold: p.isMinted
//                   };
//                 })
//               }
//             />
//           ) : (
//             <></>
//           )}
//         </div>
//       </div>
//       <div>{checkAllSteps()}</div>
//     </div>
//   );
// };

// export default SerialNumberBuySell;
