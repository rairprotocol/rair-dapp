import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const TokenLeft = ({ primaryColor }) => {
    const [percentTokens, setPersentTokens] = useState(0);

    const leftTokensNumber = 999;
    const wholeTokens = 1000;

    useEffect(() => {
        const percentLeft = (leftTokensNumber * 100) / wholeTokens;
        if (percentLeft > 1) {
            setPersentTokens(Math.floor(percentLeft));

        } 
        else if(percentLeft > 990) {
            setPersentTokens(Math.floor(percentLeft));
        }
        else {
            setPersentTokens(Math.ceil(percentLeft));
            console.log(percentLeft)
        }
    }, [setPersentTokens])

    return (
        <div className="left-tokens">
            <div className="block-left-tokens">
                <div
                    className="progress-tokens"
                    style={{ background: `${primaryColor === "rhyno" ? "rgba(34, 32, 33, 0.4)" : "rgba(34, 32, 33, 0.7)"}` }}
                >
                    {/* <CircularProgress
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
                    </div> */}
                    <Box sx={{ position: 'relative' }}>
                        <CircularProgress
                            className="progress-grey"
                            variant="determinate"
                            sx={{
                                color: (theme) =>
                                    theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                            }}
                            size={40}
                            thickness={1.5}
                            value={100}
                        />
                        <CircularProgress
                            className="progress-main"
                            variant="determinate"

                            sx={{
                                color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                                position: 'absolute',
                                left: 0,
                            }}
                            size={40}
                            thickness={4}
                            value={percentTokens}
                        />
                    </Box>
                    <div
                        className="text-progress"
                    >
                        {wholeTokens}/{leftTokensNumber}<br />
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
                    <h3>The <span className="text-gradient">Nipsey Hussle</span> legacy</h3>
                </div>
                <div className="tokens-description">
                    <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>
                        October 2013, Nipsey unveils the Crenshaw EP with a groundbreaking
                        release strategy. Sell 1000 copies for $100 each. Within 24 hours all
                        1000 were spoken for. With his next release Mailbox Money, Nipsey
                        upped the ante to $1000 for only 100 copies.
                    </p>
                    <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>
                        In collaboration with award winning producer Mr. Lee and the
                        Asghedom estate comes the final album as an exclusive 1000 only
                        streaming NFT.
                    </p>
                </div>
                <div className="btn-buy-metamask">
                    <button>Newsletter</button>
                </div>
            </div>
        </div>
    )
}

export default TokenLeft
