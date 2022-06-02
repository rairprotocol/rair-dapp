
import React from 'react'
import { NavLink, /*useParams*/ } from 'react-router-dom';
import DiscordIcon from './../../images/discord.png'
import { IFooter } from './footer.types';

const Footer: React.FC<IFooter> = ({ primaryColor, /*openAboutPage,*/ sentryHistory }) => {
    // const params = useParams();

    return (
        <footer
            className="footer col"
            style={{
                background: `${primaryColor === "rhyno" ? "#ccc" : "#424141"}`
            }}
        >
            <div className="text-rairtech" style={{ color: `${primaryColor === "rhyno" ? "#000" : ""}` }}>
                © Rairtech 2022. All rights reserved
            </div>
            {
                sentryHistory.location.pathname === "/about-page" ?
                    <ul>
                        <li>
                            <a
                                href="https://discord.gg/APmkpQzxrx"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img style={{width: 50, height: "auto"}} src={DiscordIcon} alt="discord icon" />
                            </a>

                        </li>
                    </ul>
                    : <ul>
                        <li>
                            <a
                                style={{
                                    color: `${primaryColor === "rhyno" ? "inherit" : "#fff"}`
                                }}
                                // href="mailto:inquiries@rair.tech"
                                href="https://discord.gg/Tm3KYWS7jA"
                                rel="noreferrer"
                                target="_blank"
                            >
                                {/* Inquiries */}
                                Discord channel
                            </a>
                        </li>
                        <li>
                            <NavLink
                                style={{
                                    color: `${primaryColor === "rhyno" ? "inherit" : "#fff"}`
                                }}
                                to="/terms-use"
                            >
                                Terms of Service
                            </NavLink>
                        </li>
                    </ul>
            }
        </footer>
    )
}

export default Footer
