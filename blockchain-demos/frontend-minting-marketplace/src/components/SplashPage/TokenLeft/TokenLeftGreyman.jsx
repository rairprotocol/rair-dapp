import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const TokenLeftGreyman = ({ primaryColor, Metamask }) => {
    const [percentTokens, setPersentTokens] = useState(0);

    const leftTokensNumber = 7.8;
    const wholeTokens = 7.9;

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
            }
        }
        if (leftTokensNumber > wholeTokens) {
            setPersentTokens(100)
        }
    }, [setPersentTokens])

    return (
        <div className="left-tokens greyman-page">
            <div className="block-left-content-greyman">
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
                            style={{ fontSize: `${leftTokensNumber === wholeTokens && "32px"}` }}
                        >
                            <div className="progress-info">
                                <div className="text-numbers">
                                    <div className="text-left-tokens text-gradient">{leftTokensNumber}b </div>
                                    <div className="text-whole-tokens"> / {wholeTokens}b</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="down-text">
                        Minting on demand secures your NFT on the blockhain.
                    </div>
                </div>
                <div className="btn-buy-metamask">
                    <button><img className="metamask-logo" src={Metamask} alt="metamask-logo" /> Mint with Matic</button>
                </div>
            </div>
            <div className="left-tokens-content">
                <div className="title-tokens">
                    <h3>The <span className="text-gradient">Greyman</span> story</h3>
                </div>
                <div className="tokens-description">
                    <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>
                        In the nineties I created Greyman - a fictional character which
                        reflected our 9-to-5 society in which people seemed to follow rules,
                        rather than following their Heart. In one of my paintings I depicted
                        him as a kind of modern-day Superman (the Incredible Greyman) protecting
                        the world against “Fun, Initiative, Humor, Creativity, and other plagues
                        of modern Society”
                    </p>
                    <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>
                        He became the protagonist of the imaginary world I created as an artist.
                        An imaginary world, which acted as a tweaked Black Mirror of our society.
                    </p>
                    <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>
                        After a while I abandoned the Greyman in order to prevent myself from being
                        stuck in a self-created cage, while following my own self-imposed rules,
                        and thus turning into an undercover Greyman myself. Greyman faded out of
                        existence (with a few notable cameo appearances, such as in 2002 at Burning
                        Man, when he and 120 fellow Greymen surrounded an altar in the desert,
                        where each of them could be burned in a personal ritual of freeing people
                        from their inner Greyman). Time for me to move on, following my heart
                        to explore new territories.
                    </p>
                    <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>
                        Unfortunately, in the parallel world of our real life society Greyman had
                        not disappeared. Instead, it seems that he gathered more and more power each
                        year, becomming increasingly more efficient in his use of algorithms to prevent
                        those with deviant behaviour to stray from the beaten path.
                    </p>
                    <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>
                        Hence it is the right time for Greyman to return! Time for a new cameo appearance.
                        Since Greyman was originally created when internet had just started and nobody
                        could imagine that pretty soon social media would have such a big impact, it
                        seems pretty natural that Greyman has adapted himself to this digital age by
                        appearing in pixelated form.
                    </p>
                    <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>
                        But even though he looks like many other pixelated images which pop up on your
                        screen, he's not a computer graphic, but handmade with brush and paint. I poured
                        some of my heart and soul in each pixel I painted.
                    </p>
                    <p style={{ color: `${primaryColor === "rhyno" ? "#000" : "#A7A6A6"}` }}>
                        So, move over Cryptopunks and other pixelated Avatars, PFPs, and Collectibles!
                        Here’s the OG! Even though some of you may think OG stands for Original Gangster,
                        in fact it stands for Original Greyman…..
                    </p>
                </div>
            </div>
        </div>
    )
}

export default TokenLeftGreyman
