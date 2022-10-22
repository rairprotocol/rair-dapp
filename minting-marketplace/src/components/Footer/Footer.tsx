//@ts-nocheck
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';

import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import { DiscordIcon, TelegramIcon, TwitterIcon } from '../../images';
import { SocialBox } from '../../styled-components/SocialLinkIcons/SocialLinkIcons';
import TalkSalesComponent from '../Header/HeaderItems/TalkToSalesComponent/TalkSalesComponent';

import {
  CommunityBlock,
  CommunityBoxFooter,
  FooterEmailBlock,
  FooterImage,
  FooterMain,
  FooterTextRairTech,
  FooterWrapper,
  NavFooter,
  NavFooterBox
} from './FooterItems/FooterItems';

const Footer = () => {
  const [emailChimp, setEmailChimp] = useState<string>('');

  const { headerLogo, primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );

  const onChangeEmail = (e) => {
    setEmailChimp(e.target.value);
  };

  const onSubmit = () => {
    Swal.fire(
      'Success',
      `Thank you for sign up! Check to your email ${emailChimp}`,
      'success'
    );
    setTimeout(() => {
      setEmailChimp('');
    }, 1000);
  };

  return (
    <FooterMain primaryColor={primaryColor}>
      <FooterWrapper primaryColor={primaryColor}>
        <div className="footer-box-join">
          <FooterImage>
            <NavLink to="/">
              <img src={headerLogo} alt="Rair Tech" />
            </NavLink>
          </FooterImage>
          <CommunityBlock primaryColor={primaryColor}>
            <div className="community-text">Join our community</div>
            <CommunityBoxFooter>
              <SocialBox hoverColor={'#7289d9'} primaryColor={primaryColor}>
                <a
                  href="https://discord.gg/pSTbf2yz7V"
                  target={'_blank'}
                  rel="noreferrer">
                  <DiscordIcon primaryColor={primaryColor} color={'#fff'} />
                </a>
              </SocialBox>
              <SocialBox
                marginRight={'17px'}
                marginLeft={'17px'}
                hoverColor={'#1DA1F2'}
                primaryColor={primaryColor}>
                <a
                  href="https://twitter.com/rairtech"
                  target={'_blank'}
                  rel="noreferrer">
                  <TwitterIcon primaryColor={primaryColor} color={'#fff'} />
                </a>
              </SocialBox>
              <SocialBox hoverColor={'#229ED9'} primaryColor={primaryColor}>
                <TelegramIcon primaryColor={primaryColor} color={'#fff'} />
              </SocialBox>
            </CommunityBoxFooter>
          </CommunityBlock>
        </div>
        <NavFooter>
          <NavFooterBox primaryColor={primaryColor}>
            <h4>Company</h4>
            <li>
              <NavLink to="/main-page">About</NavLink>
            </li>
            <li>
              <a
                href="https://etherscan.io/token/0xc76c3ebea0ac6ac78d9c0b324f72ca59da36b9df"
                target={'_blank'}
                rel="noreferrer">
                Contract
              </a>
            </li>
            <li>
              <TalkSalesComponent
                text={'Inquiries'}
                classes={'inquiries-sales'}
              />
            </li>
          </NavFooterBox>
          {currentUserAddress && (
            <NavFooterBox primaryColor={primaryColor}>
              <h4>My Account</h4>
              <li>
                <NavLink to="/my-items">My items</NavLink>
              </li>
              {/* <li>My collections</li> */}
              {/* <li>My favorites</li> */}
            </NavFooterBox>
          )}
        </NavFooter>
        <FooterEmailBlock primaryColor={primaryColor}>
          <h4>Stay in the loop</h4>
          <form
            action="https://tech.us16.list-manage.com/subscribe/post?u=4740c76c171ce33ffa0edd3e6&amp;id=1f95f6ad8c"
            method="post"
            id="mc-embedded-subscribe-form"
            name="mc-embedded-subscribe-form"
            className="validate"
            target="_blank"
            onSubmit={onSubmit}>
            <div className="footer-send-email">
              <input
                value={emailChimp}
                type="email"
                name="EMAIL"
                id="mce-EMAIL"
                placeholder="Enter your email"
                onChange={onChangeEmail}
                required
              />
              <button type="submit">Sign up</button>
              <div
                style={{
                  position: 'absolute',
                  left: '-5000px'
                }}
                aria-hidden="true">
                <input
                  type="text"
                  name="b_4740c76c171ce33ffa0edd3e6_1f95f6ad8c"
                />
              </div>
            </div>
          </form>
        </FooterEmailBlock>
      </FooterWrapper>
      <FooterTextRairTech>
        <ul>
          <li>© Rairtech 2022. All rights reserved</li>
          <li>
            <NavLink to="/privacy">Privacy policy</NavLink>
          </li>
          <li>
            <NavLink to="/terms-use">Terms of Service</NavLink>
          </li>
        </ul>
      </FooterTextRairTech>
    </FooterMain>
  );
};

export default Footer;
