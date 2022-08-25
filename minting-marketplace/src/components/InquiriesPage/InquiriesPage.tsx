//@ts-nocheck
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import {
  InquireButton,
  InquireContainer,
  InquireField,
  InquireInput,
  InquireLabel,
  InquireWrapper
} from './InquiriesItems';

const InquiriesPage = () => {
  const { primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const onReset = () => {
    const formEl = document.getElementById('form');
    formEl?.reset();
  };

  return (
    <InquireWrapper primaryColor={primaryColor}>
      <InquireContainer primaryColor={primaryColor}>
        <form
          // onSubmit={handleSubmit(zohoExample)}
          action="https://forms.zohopublic.com/garrett9/form/Inquiries/formperma/X0J9BJfjGn-RA0o5t0JVzhCaaE2Qt57H4f-kt9BZb-E/htmlRecords/submit"
          name="form"
          method="POST"
          acceptCharset="UTF-8"
          encType="multipart/form-data"
          id="form">
          <InquireField>
            <InquireLabel primaryColor={primaryColor}>First name</InquireLabel>{' '}
            <InquireInput
              name="Name_First"
              required
              placeholder="Type in your name"
            />
          </InquireField>
          <InquireField>
            <InquireLabel primaryColor={primaryColor}>Last name</InquireLabel>{' '}
            <InquireInput
              name="Name_Last"
              required
              placeholder="Type in your name"
            />
          </InquireField>
          <InquireField>
            <InquireLabel primaryColor={primaryColor}>Email</InquireLabel>{' '}
            <InquireInput
              name="Email"
              required
              type={'email'}
              placeholder="Type in your email"
            />
          </InquireField>
          <InquireField>
            <InquireLabel primaryColor={primaryColor}>
              Company name
            </InquireLabel>{' '}
            <InquireInput
              name="SingleLine"
              placeholder="Type in your company name"
            />
          </InquireField>
          <InquireField>
            <InquireLabel primaryColor={primaryColor}>Website</InquireLabel>{' '}
            <InquireInput
              name="SingleLine1"
              placeholder="Link to the website"
            />
          </InquireField>
          <InquireField>
            <InquireLabel primaryColor={primaryColor}>Message</InquireLabel>{' '}
            <InquireInput
              required
              name="MultiLine"
              placeholder="Type in your message"
            />
          </InquireField>
          {/* <InquireField>
            <InquireLabel primaryColor={primaryColor}>Captcha</InquireLabel>{' '}
          </InquireField> */}
          <InquireField primaryColor={primaryColor}>
            <div className="btn-hidden"></div>
            <div className="btn-box-inquire">
              <InquireButton
                primaryColor={primaryColor}
                onClick={onReset}
                type="button">
                Reset
              </InquireButton>
              <InquireButton type="submit">Submit</InquireButton>
            </div>
          </InquireField>
        </form>
      </InquireContainer>
    </InquireWrapper>
  );
};

export default InquiriesPage;
