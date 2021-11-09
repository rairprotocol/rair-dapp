import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const TokenLeft = () => {
    return (
        <div className="left-tokens">
            <div className="block-left-tokens">
                <div className="progress-tokens">
                    <CircularProgress
                        value={75}
                        // color="secondary"
                        variant="determinate"
                        sx={{
                            color: (theme) => (theme.palette.mode === 'light' ? '#AF6FD8' : '#308fe8')
                        }}
                    />
                    <div className="text-progress">
                        350<br />
                        left
                    </div>
                </div>
                <div className="down-text">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum<br />
                    dolore eu fugiat nulla pariatur.   Excepteur sint occaecat.
                </div>
            </div>
            <div className="left-tokens-content">
                <div className="title-tokens">
                    <h3>Sold <span className="text-gradient">1000 copies</span> for<br /> $100 in 2013</h3>
                </div>
                <div className="tokens-description">
                    <p>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                        dolore eu fugiat nulla pariatur. Excepteur sint occaecat.
                    </p>
                </div>
                <div className="btn-buy-metamask">
                    <button>Buy with Metamask</button>
                </div>
            </div>
        </div>
    )
}

export default TokenLeft
