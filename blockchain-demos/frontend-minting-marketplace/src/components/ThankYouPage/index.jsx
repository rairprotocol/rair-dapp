import React from 'react';
import { useHistory } from 'react-router';
import classes from './ThankYouPage.module.css';

const ThankYouPage = () => {
    const history = useHistory();

    const goBack = () => {
        history.goBack()
    };

    return (
        <div className={classes.mainBox}>
            <div className={classes.boxContent}>
                <div>
                    <h1>RAIR Technologies</h1>
                </div>
                <div className={classes.boxThank}>
                    <div class="h3">Almost finished...</div>
                    <p>We need to confirm your email address.</p>

                    <p>To complete the subscription process, please click the link in the email we just sent you.</p>

                    <div class="box-adress">
                        RAIR Technologies, INC
                        2801 W COAST HWY
                        Suite 230
                        Newport Beach, CA 92633
                    </div>

                    <a href="">Add us to your address book</a>

                    <p onClick={goBack}>« return to our website</p>
                </div>
            </div>
        </div>
    )
}

export default ThankYouPage
