import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';

import { NftItem } from './NftItem';
import { INftListComponent } from './nftList.types';

import { RootState } from '../../../ducks';
import { TNftDataItem } from '../../../ducks/nftData/nftData.types';

const NftListComponent: React.FC<INftListComponent> = ({
  data,
  titleSearch,
  sortItem
}) => {
  const loading = useSelector<RootState, boolean>(
    (store) => store.nftDataStore.loading
  );

  if (loading) {
    return (
      <div className="list-wrapper-empty">
        <CircularProgress
          sx={{ color: '#E882D5' }}
          size={100}
          thickness={4.6}
        />
      </div>
    );
    //unused-snippet
    // return (
    //   <div className="loader-wrapper">
    //     <div className="load" />
    //   </div>
    // );
  }

  const defaultImg =
    'https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW';

  const filteredData =
    data &&
    data
      .filter((item: TNftDataItem) => {
        return item.name.toLowerCase().includes(titleSearch.toLowerCase());
      })
      .sort((a, b) => {
        if (sortItem === 'up') {
          if (a.name < b.name) {
            return 1;
          }
        }

        if (sortItem === 'down') {
          if (a.name > b.name) {
            return -1;
          }
        }

        return 0;
      });

  return (
    <div className={'list-button-wrapper'}>
      {
        filteredData && filteredData.length > 0 ? (
          filteredData.map((contractData, index) => {
            if (contractData.cover !== 'none') {
              return (
                <NftItem
                  key={`${
                    contractData.id + '-' + contractData.productId + index
                  }`}
                  pict={contractData.cover ? contractData.cover : defaultImg}
                  contractName={contractData.contract}
                  price={contractData.offerData.map((p) => String(p.price))}
                  blockchain={contractData.blockchain}
                  collectionName={contractData.name}
                  ownerCollectionUser={contractData.user}
                  collectionIndexInContract={
                    contractData.collectionIndexInContract
                  }
                />
              );
            } else {
              return null;
            }
          })
        ) : (
          <div className="list-wrapper-empty">
            <h2>No items to display</h2>
          </div>
        )
        //unused-snippet
        // Array.from(new Array(10)).map((item, index) => {
        //   return (
        //     <Skeleton
        //       key={index}
        //       className={"skeloton-product"}
        //       variant="rectangular"
        //       width={283}
        //       height={280}
        //       style={{ borderRadius: 20 }}
        //     />
        //   );
        // })
        // <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "20px" }} className="preloader-product">
        //     <CircularProgress size="70px" />
        // </div>
      }
    </div>
  );
};

export const NftList = memo(NftListComponent);
