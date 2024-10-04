import React, { ChangeEvent, useEffect, useState } from 'react';

import { PaginationBoxStyled } from './PaginationBoxStyled';

import { useAppSelector } from '../../../hooks/useReduxHooks';
import { IPaginationBox } from '../mockupPage.types';

const PaginationBox: React.FC<IPaginationBox> = ({
  changePage,
  currentPage,
  totalPageForPagination,
  whatPage,
  itemsPerPageNotifications
}) => {
  const { itemsPerPage } = useAppSelector((store) => store.tokens);
  const { isDarkMode, primaryButtonColor } = useAppSelector(
    (store) => store.colors
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
  } else if (whatPage && whatPage === 'notifications' && totalPage) {
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
    } else if (
      totalPageForPagination &&
      whatPage === 'notifications' &&
      itemsPerPageNotifications
    ) {
      setTotalPages(
        getPagesCount(totalPageForPagination, itemsPerPageNotifications)
      );
    }
  }, [
    setTotalPages,
    totalPageForPagination,
    itemsPerPage,
    whatPage,
    itemsPerPageNotifications
  ]);

  if (totalPageForPagination === 0) {
    return null;
  }

  return (
    <div className={`pagination__wrapper`}>
      {pagesArray &&
        totalPageForPagination &&
        totalPageForPagination > 0 &&
        pagesArray.length > 0 && (
          <PaginationBoxStyled
            isDarkMode={isDarkMode}
            primaryButtonColor={primaryButtonColor}
            count={pagesArray.length}
            page={page}
            onChange={handlePage}
            // hideNextButton={true}
            // hidePrevButton={true}
            shape="rounded"
          />
        )}
    </div>
  );
};

export default PaginationBox;
