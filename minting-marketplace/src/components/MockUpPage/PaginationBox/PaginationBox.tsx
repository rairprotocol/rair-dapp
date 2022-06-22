//@ts-nocheck
import { Pagination } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';

const PaginationBox = ({ changePage, currentPage, primaryColor }) => {
    const [page, setPage] = useState(currentPage);
    const [totalPage, setTotalPages] = useState(null);
    const { nftListTotal, itemsPerPage, nftList } = useSelector(store => store.nftDataStore);


    let pagesArray = [];
    for (let i = 0; i < totalPage; i++) {
        pagesArray.push(i + 1);
    }

    const getPagesCount = (totalCount: number, itemsPerPage: number) => {
        return Math.ceil(totalCount / itemsPerPage);
    };

    const handlePage = (e, value) => {
        if (value !== currentPage) {
            changePage(value)
            setPage(value);
        }
    }

    useEffect(() => {
        if (nftListTotal) {
            setTotalPages(getPagesCount(nftListTotal, itemsPerPage));
        }
    }, [nftListTotal, itemsPerPage])

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
                pagesArray && nftListTotal > 0 && pagesArray.length > 0 && <Pagination
                    className={primaryColor === "rhyno" ? "pagination-white" : "pagination-black"}
                    count={pagesArray.length}
                    page={page}
                    onChange={handlePage}
                    // variant="outlined"
                    showFirstButton={true}
                    showLastButton={true}
                    hideNextButton={true}
                    hidePrevButton={true}
                    shape="rounded"
                />
                // : <h2 className="search-panel-empty-text">No items to display</h2>
            }
        </div>
    )
}

export default PaginationBox