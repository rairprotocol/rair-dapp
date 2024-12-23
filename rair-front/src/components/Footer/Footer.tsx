import { FC, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { IFooter } from './footer.types';

import { useAppSelector } from '../../hooks/useReduxHooks';
import useSwal from '../../hooks/useSwal';
import './Footer.css'

import {
  FooterImage,
  FooterMain,
  FooterTextRairTech,
  FooterWrapper,
  NavFooter,
  NavFooterBox
} from './FooterItems/FooterItems';
import MailIcon from '../../images/MailIcon';
import LocationIcon from '../../images/LocationIcon';
import PhoneIcon from '../../images/PhoneIcon';

const Footer: FC<IFooter> = () => {
  const [emailChimp, setEmailChimp] = useState<string>('');

  const { footerLinks, legal } = useAppSelector((store) => store.settings);

  const hotdropsVar = import.meta.env.VITE_TESTNET;

  const rSwal = useSwal();

  const { headerLogo, primaryColor, textColor, secondaryColor, isDarkMode } =
    useAppSelector((store) => store.colors);

  const onChangeEmail = (e) => {
    setEmailChimp(e.target.value);
  };

  const onSubmit = () => {
    rSwal.fire(
      'Success',
      `Thank you for sign up! Check to your email ${emailChimp}`,
      'success'
    );
    setTimeout(() => {
      setEmailChimp('');
    }, 1000);
  };

  return (
    <FooterMain
      hotdrops={hotdropsVar}
      isDarkMode={isDarkMode}
      primaryColor={primaryColor}
      textColor={'#fff'}
      secondaryColor={'#000'}
      >
      <FooterWrapper
        className="footer-wrappr-hotdrops"
        primaryColor={primaryColor}>
        <FooterImage>
          <NavLink to="/">
            <img style={{
              width: '150px',
              height: 'auto'
            }} src={headerLogo} alt="Evergreen Fund" />
          </NavLink>
        </FooterImage>
        <div>
        <h4>Contact Us</h4>
        <NavFooter className="footer-nav-hotdrops">
          <ul
            className="footer-nav-item"
          >
            <li>
              <MailIcon width={20} height={20} />Development@EvergreenFund.life
            </li>
            <li>
              <LocationIcon width={20} height={20} />14445 Mulholland Dr., Los Angeles, CA 90019
            </li>
            <li>
              <PhoneIcon />818-530-6378
            </li>
          </ul>
        </NavFooter>
        </div>
      </FooterWrapper>
      <FooterTextRairTech textColor={textColor} primaryColor={primaryColor}>
        <ul>
          <li>
            {legal ? (
              legal
            ) : (
              <>
                {import.meta.env.VITE_TESTNET === 'true'
                  ? ' HotDrops'
                  : ' Rairtech'}{' '}
                {new Date().getFullYear()}. All rights reserved. Onchain Wellness
              </>
            )}
          </li>
          {/* <li>
            <NavLink to="/privacy">Privacy policy</NavLink>
          </li>
          <li>
            <NavLink to="/terms-use">Terms of Service</NavLink>
          </li> */}
        </ul>
      </FooterTextRairTech>
    </FooterMain>
  );
};

export default Footer;
