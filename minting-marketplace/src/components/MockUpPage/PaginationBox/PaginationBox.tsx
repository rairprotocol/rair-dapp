import { Pagination } from '@mui/material';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../ducks';
import { IPaginationBox } from '../NftList/nftList.types';

const PaginationBox: React.FC<IPaginationBox> = ({
  changePage,
  currentPage,
  primaryColor,
  totalPageForPagination,
  whatPage
}) => {
  const itemsPerPage = useSelector<RootState, number>(
    (store) => store.nftDataStore.itemsPerPage
  );

  const [page, setPage] = useState<number>(currentPage);
  const [totalPage, setTotalPages] = useState<number>();
  const [totalPageVideo, setTotalPagesVideo] = useState<number>();

  const pagesArray: number[] = [];
  if (whatPage && whatPage === 'nft' && totalPage) {
    for (let i = 0; i < totalPage; i++) {
      pagesArray.push(i + 1);
    }
  } else if (whatPage && whatPage === 'video' && totalPageVideo) {
    for (let i = 0; i < totalPageVideo; i++) {
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
  }, [setTotalPages, totalPageForPagination, itemsPerPage, whatPage]);

  return (
    <div className="pagination__wrapper">
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
            <Pagination
              className={
                primaryColor === 'rhyno'
                  ? 'pagination-white'
                  : 'pagination-black'
              }
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
