//@ts-nocheck
import React, { memo, useContext, useState } from 'react';
import { useSelector } from 'react-redux';

import { NftItem } from './NftItem';
import { INftListComponent } from './nftList.types';

import { RootState } from '../../../ducks';
import { TNftDataItem } from '../../../ducks/nftData/nftData.types';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import { defaultHotDrops } from '../../../images';
import {
  GlobalModalContext,
  TGlobalModalContext
} from '../../../providers/ModalProvider';
import LoadingComponent from '../../common/LoadingComponent';
import HomePageFilterModal from '../../GlobalModal/FilterModal/FilterModal';
import GlobalModal from '../../GlobalModal/GlobalModal';

const NftListComponent: React.FC<INftListComponent> = ({
  data,
  titleSearch,
  sortItem
}) => {
  const loading = useSelector<RootState, boolean>(
    (store) => store.nftDataStore.loading
  );
  const { globalModalState } =
    useContext<TGlobalModalContext>(GlobalModalContext);
  const { width } = useWindowDimensions();
  const isMobileDesign = width < 1100;
  const modalParentNode = width > 1100 ? 'filter-modal-parent' : 'App';

  const [playing, setPlaying] = useState<null | number>(null);

  if (loading) {
    return <LoadingComponent />;
  }

  const defaultImg =
    import.meta.env.VITE_TESTNET === 'true'
      ? defaultHotDrops
      : `${
          import.meta.env.VITE_IPFS_GATEWAY
        }QmcV94NurwfWVGpXTST1we8uDbYiVQamKe87WEHK6DRzqa`;

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
    <div className={'nft-items-wrapper'}>
      <div
        className={`${
          width > 701
            ? 'list-button-wrapper'
            : 'list-button-wrapper-grid-template'
        } ${globalModalState?.isOpen ? 'with-modal' : ''}`}>
        {filteredData && filteredData.length > 0 ? (
          filteredData.map((contractData, index) => {
            if (contractData.cover !== 'none') {
              return (
                <NftItem
                  key={index}
                  pict={contractData.cover ? contractData.cover : defaultImg}
                  contractName={contractData.contract}
                  price={contractData.offerData.map((p) => String(p.price))}
                  blockchain={contractData.blockchain}
                  collectionName={contractData.name}
                  ownerCollectionUser={contractData.user}
                  userData={contractData.userData}
                  index={index}
                  playing={playing}
                  setPlaying={setPlaying}
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
        )}
      </div>
      <div id="filter-modal-parent">
        <GlobalModal
          parentContainerId={modalParentNode}
          renderModalContent={() => (
            <HomePageFilterModal isMobileDesign={isMobileDesign} />
          )}
        />
      </div>
    </div>
  );
};

export const NftList = memo(NftListComponent);
