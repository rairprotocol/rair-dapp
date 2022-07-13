//@ts-nocheck
import { Pagination } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const PaginationBox = ({
  changePage,
  currentPage,
  primaryColor,
  totalPageForPagination,
  whatPage
}) => {
  const { itemsPerPage } = useSelector((store) => store.nftDataStore);

  const [page, setPage] = useState(currentPage);
  const [totalPage, setTotalPages] = useState(null);
  const [totalPageVideo, setTotalPagesVideo] = useState(null);

  const pagesArray = [];
  if (whatPage && whatPage === 'nft') {
    for (let i = 0; i < totalPage; i++) {
      pagesArray.push(i + 1);
    }
  } else if (whatPage && whatPage === 'video') {
    for (let i = 0; i < totalPageVideo; i++) {
      pagesArray.push(i + 1);
    }
  }

  const getPagesCount = (totalCount: number, itemsPerPage: number) => {
    return Math.ceil(totalCount / itemsPerPage);
  };

  const handlePage = (e, value) => {
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
        pagesArray && totalPageForPagination > 0 && pagesArray.length > 0 && (
          <Pagination
            className={
              primaryColor === 'rhyno' ? 'pagination-white' : 'pagination-black'
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
