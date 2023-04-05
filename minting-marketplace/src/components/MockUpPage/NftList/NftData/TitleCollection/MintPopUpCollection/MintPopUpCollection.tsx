import React from 'react';

import { MintPopUpCollectionContainer } from './StyledMintPopUpCollection';

import CollectionInfo from '../../CollectionInfo/CollectionInfo';

const MintPopUpCollection = ({
  blockchain,
  offerDataCol,
  someUsersData,
  primaryColor,
  connectUserData,
  contractAddress,
  setPurchaseStatus
}) => {
  return (
    <MintPopUpCollectionContainer primaryColor={primaryColor}>
      <CollectionInfo
        blockchain={blockchain}
        offerData={offerDataCol}
        openTitle={false}
        someUsersData={someUsersData}
        mintToken={true}
        connectUserData={connectUserData}
        contractAddress={contractAddress}
        setPurchaseStatus={setPurchaseStatus}
      />
    </MintPopUpCollectionContainer>
  );
};

export default MintPopUpCollection;
