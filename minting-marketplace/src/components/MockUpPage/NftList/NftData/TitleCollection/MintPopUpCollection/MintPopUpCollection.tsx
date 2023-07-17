import React from 'react';

import { MintPopUpCollectionContainer } from './StyledMintPopUpCollection';

import CollectionInfo from '../../CollectionInfo/CollectionInfo';

interface IMintPopUpCollection {
  blockchain: any;
  offerDataCol: any;
  primaryColor: any;
  contractAddress: any;
  setPurchaseStatus: any;
  closeModal?: any;
}

const MintPopUpCollection: React.FC<IMintPopUpCollection> = ({
  blockchain,
  offerDataCol,
  primaryColor,
  contractAddress,
  setPurchaseStatus,
  closeModal
}) => {
  return (
    <MintPopUpCollectionContainer primaryColor={primaryColor}>
      <CollectionInfo
        closeModal={closeModal}
        blockchain={blockchain}
        offerData={offerDataCol}
        openTitle={false}
        mintToken={true}
        contractAddress={contractAddress}
        setPurchaseStatus={setPurchaseStatus}
      />
    </MintPopUpCollectionContainer>
  );
};

export default MintPopUpCollection;
