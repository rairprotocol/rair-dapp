import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const LeftTokenAbout = ({ primaryColor }) => {
    const [percentTokens, setPersentTokens] = useState(0);

    const leftTokensNumber = 1000;
    const wholeTokens = 1000;

    useEffect(() => {
        if (leftTokensNumber <= wholeTokens) {
            const percentLeft = (leftTokensNumber * 100) / wholeTokens;
            if (percentLeft > 1) {
                setPersentTokens(Math.floor(percentLeft));

            }
            else if (percentLeft > 990) {
                setPersentTokens(Math.floor(percentLeft));
            }
            else {
                setPersentTokens(Math.ceil(percentLeft));
                console.log(percentLeft)
            }
        }
        if (leftTokensNumber > wholeTokens) {
            setPersentTokens(100)
        }
    }, [setPersentTokens])

    return (
        <div className="left-tokens about-page">
            <div className="block-left-tokens">
                <div
                    className="progress-tokens"
                    style={{ background: `${primaryColor === "rhyno" ? "rgba(34, 32, 33, 0.4)" : "rgba(34, 32, 33, 0.6)"}` }}
                >
                    <div className="title-progress-left">
                        NFTs remaining
                    </div>
                    <Box className="box-progress" sx={{ position: 'relative' }}>
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
                        style={{ fontSize: `${leftTokensNumber === 1000 && "32px"}` }}
                    >
                        <div className="progress-info">
                            <div className="text-numbers">
                                <div className="text-left-tokens text-gradient">{leftTokensNumber} </div>
                                <div className="text-whole-tokens"> / {wholeTokens}</div>
                            </div>
                            <div>left</div>
                        </div>
                    </div>
                </div>
                <div className="down-text">
                    Minting on demand secures your NFT on the blockhain.Unique <br />
                    artwork to follow based on examples shown.
                </div>
            </div>
            <div className="left-tokens-content">
                <div className="title-tokens">
                    <h3><span className="text-gradient">Mission</span></h3>
                </div>
                <div className="tokens-description">
                    <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>
                        Data monopolies like Amazon, YouTube, Google,
                        Apple, and Netflix charge onerous fees, offer opaque
                        analytics, and can change their terms of service at any
                        time locking out creators and users alike.

                    </p>
                    <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>
                        DIY distribution meanwhile offers no protection, and
                        cannot help package works into a scarce, valuable,
                        tradeable framework.
                    </p>
                    <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>
                        RAIR, through its decentralized key management
                        node system, empowers anyone to create unique,
                        controllable, and transferable digital assets tied to
                        the actual underlying content.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LeftTokenAbout
