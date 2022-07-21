//@ts-nocheck
import React from 'react';
import { OnboardingButton } from '../../common/OnboardingButton/OnboardingButton';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItem } from './../NavigationItems/NavigationItems';
import { NavLink } from 'react-router-dom';
import { setColorScheme } from '../../../ducks/colors/actions';

const MobileListMenu = ({
  primaryColor,
  click,
  renderBtnConnect,
  loginDone,
  startedLogin,
  connectUserData,
  toggleOpenProfile,
  logout,
  adminRights,
  creatorViewsDisabled,
  toggleMenu
}) => {
  const {
    minterInstance,
    factoryInstance,
    programmaticProvider,
    diamondMarketplaceInstance
  } = useSelector((store) => store.contractStore);

  const dispatch = useDispatch();

  return (
    <List primaryColor={primaryColor} click={click}>
      {!loginDone && !renderBtnConnect && (
        <ListItem primaryColor={primaryColor}>
          <div className="btn-connect-wallet-wrapper">
            <button
              disabled={
                !window.ethereum && !programmaticProvider && !startedLogin
              }
              className={`btn btn-${primaryColor} btn-connect-wallet`}
              onClick={connectUserData}>
              {startedLogin ? 'Please wait...' : 'Connect Wallet'}
            </button>
          </div>
        </ListItem>
      )}
      {renderBtnConnect && (
        <ListItem>
          <OnboardingButton className="borading-btn-mobile" />
        </ListItem>
      )}
      {loginDone && (
        <ListItem primaryColor={primaryColor}>
          <div className="burder-menu-profile" onClick={toggleOpenProfile}>
            <i className="fas fa-cog"></i>Profile settings
          </div>
        </ListItem>
      )}
      {loginDone && (
        <ListItem onClick={toggleMenu} primaryColor={primaryColor}>
          <NavLink to="/my-items">
            <div className="burder-menu-profile">
              <i className="fas fa-boxes"></i>My Items
            </div>
          </NavLink>
        </ListItem>
      )}
      <ListItem primaryColor={primaryColor}>
        <a href="https://rair.tech/" target="_blank" rel="noreferrer">
          RAIR TECH
        </a>
      </ListItem>
      <ListItem primaryColor={primaryColor}>
        <button
          className="btn-change-theme"
          style={{
            backgroundColor:
              primaryColor === 'charcoal' ? '#222021' : '#D3D2D3',
            borderRadius: '12px',
            width: 32,
            height: 32,
            fontSize: 18
          }}
          onClick={() => {
            dispatch(
              setColorScheme(primaryColor === 'rhyno' ? 'charcoal' : 'rhyno')
            );
          }}>
          {primaryColor === 'rhyno' ? (
            <i className="far fa-moon" />
          ) : (
            <i className="fas fa-sun" />
          )}
        </button>
      </ListItem>
      {loginDone && adminRights === true && !creatorViewsDisabled ? (
        [
          {
            name: <i className="fas fa-photo-video" />,
            route: '/all',
            disabled: !loginDone
          },
          { name: <i className="fas fa-key" />, route: '/my-nft' },
          {
            name: <i className="fa fa-id-card" aria-hidden="true" />,
            route: '/new-factory',
            disabled: !loginDone
          },
          {
            name: <i className="fa fa-shopping-cart" aria-hidden="true" />,
            route: '/on-sale',
            disabled: !loginDone
          },
          {
            name: <i className="fa fa-user-secret" aria-hidden="true" />,
            route: '/admin/fileUpload',
            disabled: !loginDone
          },
          {
            name: <i className="fas fa-city" />,
            route: '/factory',
            disabled: factoryInstance === undefined
          },
          {
            name: <i className="fas fa-shopping-basket" />,
            route: '/minter',
            disabled: minterInstance === undefined
          },
          {
            name: <i className="fas fa-gem" />,
            route: '/diamondMinter',
            disabled: diamondMarketplaceInstance === undefined
          },
          {
            name: <i className="fas fa-exchange" />,
            route: '/admin/transferNFTs',
            disabled: !loginDone
          }
        ].map((item, index) => {
          if (!item.disabled) {
            return (
              <ListItem
                primaryColor={primaryColor}
                onClick={toggleMenu}
                key={index}>
                <NavLink
                  className={({ isActive }) => {
                    return `py-3 ${isActive ? `active-${primaryColor}` : ''}`;
                  }}
                  to={item.route}
                  style={{ textDecoration: 'none' }}>
                  {item.name}
                </NavLink>
              </ListItem>
            );
          }
          return <div key={index}></div>;
        })
      ) : (
        <></>
      )}
      {loginDone && (
        <ListItem primaryColor={primaryColor} onClick={logout}>
          <div className="burger-menu-logout">
            <i className="fas fa-sign-out-alt"></i>Logout
          </div>
        </ListItem>
      )}
    </List>
  );
};

export default MobileListMenu;
