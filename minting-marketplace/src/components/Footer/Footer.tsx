import React from 'react'
import { IFooter } from './footer.types';
import { NavLink } from 'react-router-dom';
import DiscordIcon from './../../images/discord.png'

const Footer: React.FC<IFooter> = ({ primaryColor, sentryHistory }) => {
    return (
        <footer
            className={`footer col ${primaryColor === "rhyno" ? "rhyno" : ""}`}
        >
            <div className={`text-rairtech ${primaryColor === "rhyno" ? "rhyno" : ""}`}>
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
                                <img src={DiscordIcon} alt="discord icon" />
                            </a>

                        </li>
                    </ul>
                    : <ul>
                        <li>
                            <a
                                className={`footer-link ${primaryColor === "rhyno" ? "rhyno" : ""}`}

                                // href="mailto:inquiries@rair.tech"
                                href="https://discord.gg/Tm3KYWS7jA"
                                rel="noreferrer"
                                target="_blank"
                            >
                                Discord channel
                            </a>
                        </li>
                        <li>
                            <NavLink
                                className={`footer-link ${primaryColor === "rhyno" ? "rhyno" : ""}`}

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
