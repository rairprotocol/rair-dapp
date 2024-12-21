//@ts-nocheck
import { memo, useCallback, useEffect, useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

import useWindowDimensions from "../../../../hooks/useWindowDimensions";
import { NftItemToken } from "../../../../types/commonTypes";
import LoadingComponent from "../../../common/LoadingComponent";
import { MobileCloseBtn } from "../../../GlobalModal/FilterModal/FilterModalIcons";
import { HomePageModalFilter } from "../../../GlobalModal/FilterModal/HomePAgeModal";
import { MobileHeaderBlock } from "../../../GlobalModal/FilterModal/MobileHeaderBlock";
import { NftItemForCollectionView } from "../../../MockUpPage/NftList/NftItemForCollectionView";

import "./PersonalProfileMyNftTab.css";

interface IPersonalProfileMyNftTabComponent {
  filteredData?: NftItemToken[];
  openModal?: any;
  setSelectedData?: any;
  defaultImg: string;
  textColor: any;
  totalCount?: number | undefined;
  isLoading?: boolean;
  loadToken?: any;
  profile?: boolean;
  getMyNft?: (number: number, page: number) => void;
  showTokensRef?: any;
  titleSearch: string;
  primaryColor?: string;
  isResaleLoading?: boolean;
  setOnResale?: any;
  onResale?: boolean;
  setIsResaleLoding?: any;
  metadataFilter?: boolean;
  setMetadataFilter?: any;
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
  titleSearch,
  primaryColor,
  isResaleLoading,
  setOnResale,
  onResale,
  setIsResaleLoding,
  metadataFilter,
  setMetadataFilter,
}) => {
  const { width } = useWindowDimensions();
  const [playing, setPlaying] = useState<null | string>(null);
  const loader = useRef(null);

  const isMobileDesign = width < 1100;

  const toggleFilterDropdown = () => {
    setOnResale && setOnResale((prev) => !prev);
    setIsResaleLoding && setIsResaleLoding(true);
    if (isMobileDesign) {
      setMetadataFilter(false);
    }
  };

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
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(loadToken, option);
    if (loader.current) observer.observe(loader.current);
  }, [loadToken, loader, isLoading]);

  if (!filteredData) {
    return <LoadingComponent />;
  }

  return (
    <>
      <div
        style={{
          display: "flex",
        }}
        className="gen"
      >
        {isResaleLoading ? (
          <LoadingComponent />
        ) : (
          <div
            className={`list-button-wrapper-grid-template ${
              profile && "row profile"
            } ${metadataFilter ? "with-modal" : ""}`}
          >
            {filteredData.length > 0 ? (
              filteredData
                .filter((el) =>
                  el.metadata.name
                    .toLowerCase()
                    .includes(titleSearch.toLowerCase())
                )
                .map((item, index) => {
                  if (item.contract.blockchain === "0x38") {
                    return null;
                  } else {
                    return (
                      <NftItemForCollectionView
                        id={`collection-view-${index}`}
                        key={index}
                        metadataFilter={metadataFilter}
                        pict={item.metadata.image}
                        metadata={item.metadata}
                        item={item}
                        resaleFlag={true}
                        // offerPrice={offerPrice}
                        blockchain={item.contract.blockchain}
                        // selectedData={selectedData}
                        resalePrice={item?.resaleData?.price}
                        index={item.token}
                        indexId={index.toString()}
                        // offerData={offerDataCol}
                        offer={item.offer}
                        // someUsersData={someUsersData}
                        userName={item.ownerAddress}
                        setPlaying={setPlaying}
                        playing={playing}
                        diamond={item.contract.diamond}
                        getMyNft={getMyNft}
                        totalNft={showTokensRef.current}
                      />
                    );
                  }
                })
            ) : (
              <h3 style={{ color: textColor }}>No items found</h3>
            )}
          </div>
        )}

        {metadataFilter && primaryColor && (
          <div id="filter-modal-parent">
            <HomePageModalFilter
              isMobileDesign={isMobileDesign}
              style={{
                background: `color-mix(in srgb, ${primaryColor}, #aaaaaa)`,
              }}
              id="home-page-modal-filter"
              className={`filter-modal-wrapper ${
                isMobileDesign && metadataFilter && "with-modal"
              }`}
            >
              {isMobileDesign && (
                <MobileHeaderBlock className="mobile-close-btn-container">
                  <span className="filter-header">Filters</span>
                  <button
                    className="mobile-close-btn"
                    onClick={() => setMetadataFilter((prev) => !prev)}
                  >
                    <MobileCloseBtn className="" />
                  </button>
                </MobileHeaderBlock>
              )}
              <div
                className="dropdown-option-wrapper"
                key={Math.random() * 1_000_000}
              >
                <span
                  key={Math.random() * 1_000_000}
                  className="dropdown-option-text"
                >
                  Filter resale
                </span>
                <input
                  className={`dropdown-option-checkbox ${
                    isMobileDesign ? "mobile-checkbox" : ""
                  }`}
                  disabled={isResaleLoading}
                  type="checkbox"
                  value={5}
                  onChange={toggleFilterDropdown}
                  checked={onResale}
                />
              </div>
            </HomePageModalFilter>
          </div>
        )}
      </div>
      {!onResale && isLoading && (
        <div className="progress-token">
          <CircularProgress
            style={{
              width: "70px",
              height: "70px",
            }}
          />
        </div>
      )}
      {!onResale && !!totalCount && showTokensRef.current <= totalCount && (
        <div ref={loader} className="ref"></div>
      )}
    </>
  );
};

export const PersonalProfileMyNftTab = memo(PersonalProfileMyNftTabComponent);
