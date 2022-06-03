//@ts-check
import { Pagination } from '@mui/material'
import React, { useState } from 'react'

const PaginationBox = ({ pagesArray, changePage, currentPage, primaryColor }) => {
    const [page, setPage] = useState(currentPage);

    const handlePage = (e, value) => {
        if (value !== currentPage) {
            changePage(value)
            setPage(value);
        }
    }

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
                pagesArray && pagesArray.length > 0 ? <Pagination
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
                /> : <h2 className="search-panel-empty-text">No items to display</h2>
            }
        </div>
    )
}

export default PaginationBox