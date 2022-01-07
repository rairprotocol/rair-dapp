import React from 'react'

const Footer = ({primaryColor, openAboutPage}) => {
    return (
        <footer
            className="footer col"
            style={{
                background: `${primaryColor === "rhyno" ? "#ccc" : ""}`
            }}
        >
            <div className="text-rairtech" style={{ color: `${primaryColor === "rhyno" ? "#000" : ""}` }}>
                © Rairtech 2021. All rights reserved
            </div>
            <ul>
                <li>newsletter</li>
                <li>contact</li>
                <li>inquiries</li>
                <li onClick={() => openAboutPage()}>about us</li>
            </ul>
        </footer>
    )
}

export default Footer
