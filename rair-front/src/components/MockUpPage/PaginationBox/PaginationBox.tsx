import React, { ChangeEvent, useEffect, useState } from 'react';

import { PaginationBoxStyled } from './PaginationBoxStyled';

import { useAppSelector } from '../../../hooks/useReduxHooks';
import { IPaginationBox } from '../mockupPage.types';

const PaginationBox: React.FC<IPaginationBox> = ({
  changePage,
  totalPageForPagination,
  whatPage,
  itemsPerPageNotifications
}) => {
  const { itemsPerPage, currentPage } = useAppSelector((store) => store.tokens);

  const { isDarkMode, primaryButtonColor } = useAppSelector(
    (store) => store.colors
  );

  const [page, setPage] = useState<number>(currentPage);
  const [pagesArray, setPagesArray] = useState<Array<number>>([]);

  // const hotdropsVar = import.meta.env.VITE_TESTNET;

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
    if (!totalPageForPagination) {
      return;
    }
    let totalPages = 0;
    switch (whatPage) {
      case 'nft':
        totalPages = getPagesCount(totalPageForPagination, itemsPerPage);
        break;
      case 'video':
        totalPages = getPagesCount(totalPageForPagination, itemsPerPage);
        break;
      case 'notifications':
        totalPages = getPagesCount(
          totalPageForPagination,
          itemsPerPageNotifications || 0
        );
        break;
    }
    const pageArray: Array<number> = [];
    for (let i = 0; i < totalPages; i++) {
      pageArray.push(i + 1);
    }
    setPagesArray(pageArray);
  }, [
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
            showFirstButton={false}
            onChange={handlePage}
            shape="rounded"
          />
        )}
    </div>
  );
};

export default PaginationBox;
