import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import "./SharePopUp.css";

const SharePopUp = ({ setSharePopUp, shareRef }) => {
    const [copySuccess, setCopySuccess] = useState('Copy link');
    const currentUrl = document.location.href;
    const { headerLogo } = useSelector(store => store.colorStore)


    function copyStringToClipboard(str) {
        var el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        setCopySuccess("Copies");
    }

    const closePopUp = () => {
        copyStringToClipboard(currentUrl);
        setTimeout(() => {
            setSharePopUp(false);
        }, 1000)
    }

    return <div ref={shareRef} className="share-pop-up">
        <button className="share-copy-link" onClick={closePopUp}>
            {
                copySuccess === "Copy link" ? <>
                    <img src={headerLogo} alt="rair tech" />
                    {copySuccess}
                </> : copySuccess
            }
        </button>
        <button className="share-copy-link">
            <FacebookShareButton
                className="network__share-button"
                url={currentUrl}
                quote={"Rair tech"}
            >
                <i className="fab fa-facebook"></i>
            </FacebookShareButton>
        </button>
        <button className="share-copy-link">
            <TwitterShareButton
                url={currentUrl}
                quote={"Rair tech"}
            >
                <i className="fab fa-twitter"></i>
            </TwitterShareButton>
        </button>
    </div>
};

export default SharePopUp;
