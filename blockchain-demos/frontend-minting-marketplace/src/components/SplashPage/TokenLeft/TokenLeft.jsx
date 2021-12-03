import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const TokenLeft = ({ primaryColor }) => {
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
        <div className="left-tokens">
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
                <div className="mailchimp">
                    <form action="https://tech.us16.list-manage.com/subscribe/post?u=4740c76c171ce33ffa0edd3e6&amp;id=1f95f6ad8c" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                        <div className="signup_scroll">
                            <div className="email-box">
                                <input type="email" name="EMAIL" className="email" id="mce-EMAIL" placeholder="Join our email list for updates & drops" required />
                            </div>
                            <div style={{
                                position: "absolute", left: "-5000px"
                            }} aria-hidden="true">
                                <input type="text" name="b_4740c76c171ce33ffa0edd3e6_1f95f6ad8c" tabIndex="-1" />
                            </div>
                            <div className="btn-subscribe">
                                <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="button" />
                            </div>
                        </div>
                    </form>
                </div>
                {/* <div className="mailchimp">
                    <div className="email-box">
                        <input type="text" placeholder="Join our email list for updates & drops" />
                    </div>
                    <div className="btn-subscribe">
                        <button>SUBCRIBE</button>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default TokenLeft
