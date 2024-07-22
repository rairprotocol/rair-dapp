import React, { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { PaginationBoxStyled } from './PaginationBoxStyled';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { IPaginationBox } from '../mockupPage.types';

const PaginationBox: React.FC<IPaginationBox> = ({
  changePage,
  currentPage,
  totalPageForPagination,
  whatPage,
  itemsPerPageNotifications
}) => {
  const itemsPerPage = useSelector<RootState, number>(
    (store) => store.nftDataStore.itemsPerPage
  );

  const { primaryColor, primaryButtonColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  const [page, setPage] = useState<number>(currentPage);
  const [totalPage, setTotalPages] = useState<number>();
  const [totalPageVideo, setTotalPagesVideo] = useState<number>();

  // const hotdropsVar = import.meta.env.VITE_TESTNET;

  const pagesArray: number[] = [];
  if (whatPage && whatPage === 'nft' && totalPage) {
    for (let i = 0; i < totalPage; i++) {
      pagesArray.push(i + 1);
    }
  } else if (whatPage && whatPage === 'video' && totalPageVideo) {
    for (let i = 0; i < totalPageVideo; i++) {
      pagesArray.push(i + 1);
    }
  } else if(whatPage && whatPage === 'notifications' && totalPage) {
    for (let i = 0; i < totalPage; i++) {
      pagesArray.push(i + 1);
    }
  }

  const getPagesCount = (totalCount: number, itemsPerPage: number) => {
    return Math.ceil(totalCount / itemsPerPage);
  };

  const handlePage = (e: ChangeEvent<unknown>, value: number) => {
    if (value !== currentPage) {
      changePage(value);
      setPage(value);
    }
  };

  useEffect(() => {
    if (totalPageForPagination && whatPage === 'nft') {
      setTotalPages(getPagesCount(totalPageForPagination, itemsPerPage));
    } else if (totalPageForPagination && whatPage === 'video') {
      setTotalPagesVideo(getPagesCount(totalPageForPagination, itemsPerPage));
    }
    else if(totalPageForPagination && whatPage === 'notifications' && itemsPerPageNotifications){
        setTotalPages(getPagesCount(totalPageForPagination, itemsPerPageNotifications));
    }
  }, [setTotalPages, totalPageForPagination, itemsPerPage, whatPage, itemsPerPageNotifications]);

  if (totalPageForPagination === 0) {
    return null;
  }

  return (
    <div className={`pagination__wrapper`}>
      {/* {pagesArray && pagesArray.length > 0 ? (
                pagesArray.map((p) => (
                    <div
                        key={p}
                        onClick={() => changePage(p)}
                        className={
                            currentPage === p
                                ? "pagination__page pagination__page__current"
                                : "pagination__page"
                        }
                    >
                        {p}
                    </div>
                ))
            ) : (
                <h2 className="search-panel-empty-text">No items to display</h2>
            )} */}
      {
        pagesArray &&
          totalPageForPagination &&
          totalPageForPagination > 0 &&
          pagesArray.length > 0 && (
            <PaginationBoxStyled
              primarycolor={primaryColor}
              primaryButtonColor={primaryButtonColor}
              // className={
              //   primaryColor === '#dedede'
              //     ? `pagination-white ${
              //         hotdropsVar === 'true' ? 'hotdrops-color' : ''
              //       }`
              //     : `pagination-black ${
              //         hotdropsVar === 'true' ? 'hotdrops-color' : ''
              //       }`
              // }
              count={pagesArray.length}
              page={page}
              onChange={handlePage}
              // variant="outlined"
              // hideNextButton={true}
              // hidePrevButton={true}
              shape="rounded"
            />
          )
        // : <h2 className="search-panel-empty-text">No items to display</h2>
      }
    </div>
  );
};

export default PaginationBox;
