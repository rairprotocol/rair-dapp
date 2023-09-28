import { memo, useCallback, useEffect, useRef, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import LoadingComponent from '../../../common/LoadingComponent';
import { NftItemForCollectionView } from '../../../MockUpPage/NftList/NftItemForCollectionView';

import './PersonalProfileMyNftTab.css';

interface IPersonalProfileMyNftTabComponent {
  filteredData: any;
  openModal?: any;
  setSelectedData?: any;
  defaultImg: string;
  chainData: any;
  textColor: any;
  totalCount?: number | undefined;
  isLoading?: boolean;
  loadToken?: any;
  profile?: boolean;
  getMyNft?: (number: number, page: number) => void;
  showTokensRef?: any;
  titleSearch: string;
}

const PersonalProfileMyNftTabComponent: React.FC<
  IPersonalProfileMyNftTabComponent
> = ({
  filteredData,
  textColor,
  profile,
  getMyNft,
  totalCount,
  isLoading,
  showTokensRef,
  titleSearch
}) => {
  const { width } = useWindowDimensions();
  const [playing, setPlaying] = useState<null | string>(null);
  const loader = useRef(null);

  const loadToken = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        showTokensRef.current = showTokensRef.current + 40;
        if (getMyNft) {
          getMyNft(Number(showTokensRef.current), 1);
        }
      }
    },
    [getMyNft, showTokensRef]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 0
    };
    const observer = new IntersectionObserver(loadToken, option);
    if (loader.current) observer.observe(loader.current);
  }, [loadToken, loader, isLoading]);

  if (!filteredData) {
    return <LoadingComponent />;
  }

  return (
    <div className="gen">
      <div
        className={`list-button-wrapper-grid-template ${
          (profile && 'row profile') ||
          (width >= 1250 && width <= 1400 && 'row')
        }`}>
        {filteredData.length > 0 ? (
          filteredData
            .filter((el) =>
              el.metadata.name.toLowerCase().includes(titleSearch.toLowerCase())
            )
            .map((item, index) => {
              if (item.contract.blockchain === '0x38') {
                return null;
              } else {
                return (
                  <NftItemForCollectionView
                    id={`collection-view-${index}`}
                    key={`${
                      item._id + '-' + item.uniqueIndexInContract + index
                    }`}
                    pict={item.metadata.image}
                    metadata={item.metadata}
                    item={item}
                    // offerPrice={offerPrice}
                    blockchain={item.contract.blockchain}
                    // selectedData={selectedData}
                    index={item.token}
                    indexId={index.toString()}
                    // offerData={offerDataCol}
                    offer={item.offer}
                    // someUsersData={someUsersData}
                    userName={item.ownerAddress}
                    setPlaying={setPlaying}
                    playing={playing}
                    diamond={item.contract.diamond}
                  />
                );
              }
            })
        ) : (
          <p style={{ color: textColor }}>
            There is no such item with that name
          </p>
        )}
      </div>
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
      {totalCount && showTokensRef.current <= totalCount && (
        <div ref={loader} className="ref"></div>
      )}
    </div>
  );
};

export const PersonalProfileMyNftTab = memo(PersonalProfileMyNftTabComponent);
