import { ChangeEvent, useState } from 'react';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MailchimpComponent = () => {
  const [emailField, setEmailField] = useState<string>('');

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailField(e.target.value);
  };

  return (
    <div className="mailchimp">
      <form
        action="https://tech.us16.list-manage.com/subscribe/post?u=4740c76c171ce33ffa0edd3e6&amp;id=1f95f6ad8c"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        className="validate"
        target="_blank"
        noValidate>
        <div className="signup_scroll">
          <div className="email-box">
            <input
              onChange={onChangeEmail}
              value={emailField}
              type="email"
              name="EMAIL"
              className="email"
              id="mce-EMAIL"
              placeholder="Sign up for our newsletter.."
              required
            />
            <button
              disabled={emailField.length > 5 ? false : true}
              type="submit"
              value="Subscribe"
              name="subscribe"
              id="mc-embedded-subscribe">
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
          <div
            style={{
              position: 'absolute',
              left: '-5000px'
            }}
            aria-hidden="true">
            <input
              type="text"
              name="b_4740c76c171ce33ffa0edd3e6_1f95f6ad8c"
              tabIndex={-1}
            />
          </div>
          <div className="btn-subscribe">
            {/* <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="button" required /> */}
          </div>
        </div>
      </form>
    </div>
  );
};

export default MailchimpComponent;
