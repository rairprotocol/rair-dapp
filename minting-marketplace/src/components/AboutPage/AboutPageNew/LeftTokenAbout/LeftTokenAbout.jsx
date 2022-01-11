import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const LeftTokenAbout = ({ primaryColor }) => {
    return (
        <div className="left-tokens about-page">
            <div className="block-left-tokens">
        
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
