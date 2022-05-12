//@ts-nocheck
import React from 'react';
import "./NotFound.css";
import { useHistory } from 'react-router-dom';

const NotFound = () => {
    const history = useHistory();

    const goBack = () => {
        history.goBack();
    }

    return (
        <div className="not-found-page">
            <h3><span className="text-404">404</span></h3>
            <h3>Page not found</h3>
            <p>We are sorry but the page you are looking for does not exist.</p>

            <div onClick={goBack} className="go-back">Back</div>
        </div>
    )
}

export default NotFound