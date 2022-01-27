import React from 'react'
import { NavLink } from 'react-router-dom'

const Footer = ({ primaryColor, openAboutPage }) => {
    return (
        <footer
            className="footer col"
            style={{
                background: `${primaryColor === "rhyno" ? "#ccc" : "#424141"}`
            }}
        >
            <div className="text-rairtech" style={{ color: `${primaryColor === "rhyno" ? "#000" : ""}` }}>
                © Rairtech 2021. All rights reserved
            </div>
            <ul>
                <li>
                    <a
                        style={{
                            color: `${primaryColor === "rhyno" ? "inherit" : "#fff"}`
                        }}
                        href="https://tech.us16.list-manage.com/subscribe/post?u=4740c76c171ce33ffa0edd3e6&id=1f95f6ad8c"
                        rel="noreferrer"
                        target="_blank"
                    >
                        Newsletter
                    </a>
                </li>
                <li>
                    <a
                        style={{
                            color: `${primaryColor === "rhyno" ? "inherit" : "#fff"}`
                        }}
                        target="_blank"
                        rel="noreferrer"
                        href="https://etherscan.io/error.html?404"
                    >
                        Contract
                    </a>
                </li>
                <li>
                    <a
                        style={{
                            color: `${primaryColor === "rhyno" ? "inherit" : "#fff"}`
                        }}
                        href="https://discord.gg/7KaSHNJ7qS"
                        rel="noreferrer"
                        target="_blank"
                    >
                        Inquiries
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
                <li
                    style={{
                        color: `${primaryColor === "rhyno" ? "inherit" : "#fff"}`
                    }}
                    onClick={() => openAboutPage()}
                >
                    About us
                </li>
            </ul>
        </footer>
    )
}

export default Footer
