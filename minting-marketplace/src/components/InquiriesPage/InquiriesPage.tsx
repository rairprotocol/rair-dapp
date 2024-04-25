//@ts-nocheck
import React from 'react';
import { useSelector } from 'react-redux';

import {
  InquireButton,
  InquireContainer,
  InquireField,
  InquireInput,
  InquireLabel,
  InquireTextarea,
  InquireWrapper
} from './InquiriesItems';

import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';

const InquiriesPage = () => {
  const { primaryColor, primaryButtonColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  const { currentUserAddress } = useSelector((store) => store.contractStore);

  const { userRd } = useSelector<RootState, TUsersInitialState>(
    (store) => store.userStore
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
          <>
            {currentUserAddress && userRd ? (
              <>
                {userRd && !userRd.email && (
                  <>
                    <InquireField>
                      <InquireLabel primaryColor={primaryColor}>
                        First name
                      </InquireLabel>{' '}
                      <InquireInput
                        name="Name_Last"
                        required
                        placeholder="Type in your First name"
                      />
                    </InquireField>
                    <InquireField>
                      <InquireLabel primaryColor={primaryColor}>
                        Last name
                      </InquireLabel>{' '}
                      <InquireInput
                        name="Name_First"
                        required
                        placeholder="Type in your Last name"
                      />
                    </InquireField>
                    <InquireField>
                      <InquireLabel primaryColor={primaryColor}>
                        Email
                      </InquireLabel>{' '}
                      <InquireInput
                        name="Email"
                        required
                        type={'email'}
                        placeholder="Type in your email"
                      />
                    </InquireField>
                  </>
                )}
                <InquireInput
                  style={{
                    display: 'none'
                  }}
                  value={' '}
                  name="Name_Last"
                  placeholder="Type in your First name"
                />
                <InquireInput
                  style={{
                    display: 'none'
                  }}
                  value={userRd.nickName ? userRd.nickName : ''}
                  name="Name_First"
                  placeholder="Type in your First name"
                />
                <InquireInput
                  style={{
                    display: 'none'
                  }}
                  value={userRd.email ? userRd.email : ''}
                  name="Email"
                  placeholder="Type in your First name"
                />
                <InquireField
                  className={`${
                    userRd.email ? 'block-user-inquire-message' : ''
                  }`}>
                  <InquireLabel
                    className={`${
                      userRd.email ? 'label-user-inquire-message' : ''
                    }`}
                    primaryColor={primaryColor}>
                    Message
                  </InquireLabel>{' '}
                  <InquireTextarea
                    className="imquire-message-input"
                    required
                    name="MultiLine"
                    placeholder="Type in your message"
                  />
                </InquireField>
                <InquireField
                  className={`${
                    userRd.email ? 'block-user-inquire-message' : ''
                  }`}
                  primaryColor={primaryColor}>
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
              </>
            ) : (
              <>
                <InquireField>
                  <InquireLabel primaryColor={primaryColor}>
                    First name
                  </InquireLabel>{' '}
                  <InquireInput
                    name="Name_Last"
                    required
                    placeholder="Type in your First name"
                  />
                </InquireField>
                <InquireField>
                  <InquireLabel primaryColor={primaryColor}>
                    Last name
                  </InquireLabel>{' '}
                  <InquireInput
                    name="Name_First"
                    required
                    placeholder="Type in your Last name"
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
                  <InquireLabel primaryColor={primaryColor}>
                    Ethereum Address
                  </InquireLabel>{' '}
                  <InquireInput
                    name="SingleLine"
                    placeholder="Type in your wallet address"
                  />
                </InquireField>
                <InquireField>
                  <InquireLabel primaryColor={primaryColor}>
                    Website
                  </InquireLabel>{' '}
                  <InquireInput
                    name="SingleLine1"
                    placeholder="Link to the website"
                  />
                </InquireField>
                <InquireField>
                  <InquireLabel primaryColor={primaryColor}>
                    Message
                  </InquireLabel>{' '}
                  <InquireInput
                    required
                    name="MultiLine"
                    placeholder="Type in your message"
                  />
                </InquireField>
                <InquireField primaryColor={primaryColor}>
                  <div className="btn-hidden"></div>
                  <div className="btn-box-inquire">
                    <InquireButton
                      primaryColor={primaryColor}
                      onClick={onReset}
                      type="button">
                      Reset
                    </InquireButton>
                    <InquireButton
                      background={`${
                        primaryColor === '#dedede'
                          ? import.meta.env.VITE_TESTNET === 'true'
                            ? 'var(--hot-drops)'
                            : 'linear-gradient(to right, #e882d5, #725bdb)'
                          : import.meta.env.VITE_TESTNET === 'true'
                            ? primaryButtonColor ===
                              'linear-gradient(to right, #e882d5, #725bdb)'
                              ? 'var(--hot-drops)'
                              : primaryButtonColor
                            : primaryButtonColor
                      }`}
                      type="submit">
                      Submit
                    </InquireButton>
                  </div>
                </InquireField>
              </>
            )}
          </>
        </form>
      </InquireContainer>
    </InquireWrapper>
  );
};

export default InquiriesPage;
