import React from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const MainLogo = ({ goHome, sentryHistory, headerLogo, headerLogoBlack, headerLogoWhite, primaryColor }) => {
    const params = useParams();

    return (
        <>
            {sentryHistory.location.pathname === "/about-page" ? <div></div>
                : <img
                    onClick={() => goHome()}
                    alt='Header Logo'
                    src={headerLogo}
                    className='h-100 header_logo'
                />
            }
        </>
    )
}

export default MainLogo