
import React from 'react';
import { IMainLogo } from './mainLogo.types';
// import { useEffect } from 'react';
// import { useParams } from 'react-router-dom';

const MainLogo: React.FC<IMainLogo> = ({ goHome, sentryHistory, headerLogo, headerLogoBlack, headerLogoWhite, primaryColor }) => {
    // const params = useParams();

    return (
        <>
            {sentryHistory.location.pathname === "/about-page" ? <div>
                <img
                    onClick={() => goHome()}
                    alt='Header Logo'
                    src={headerLogoWhite}
                    style={{
                        width: "auto",
                        height: "32px",
                        cursor: "pointer"
                    }}
                // className='h-100 header_logo'
                />
            </div>
                : <img
                    onClick={() => goHome()}
                    alt='Header Logo'
                    src={headerLogo}
                    style={{
                        width: "auto",
                        height: "55px",
                        cursor: "pointer"
                    }}
                // className='h-100 header_logo'
                />
            }
        </>
    )
}

export default MainLogo