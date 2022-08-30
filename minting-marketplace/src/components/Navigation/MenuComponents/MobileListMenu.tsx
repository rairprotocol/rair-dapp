import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, SearchInputMobile } from './../NavigationItems/NavigationItems';
import {
  CommunityBlock,
  CommunityBoxFooter
} from '../../Footer/FooterItems/FooterItems';
import {
  DiscordIcon,
  TelegramIcon,
  TwitterIcon
} from '../../Header/DiscordIcon';
import { SocialBox } from '../../../styled-components/SocialLinkIcons/SocialLinkIcons';
import MobileNavigationList from './MobileNavigationList';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import { RootState } from '../../../ducks';

interface IMobileListMenu {
  click: boolean;
  messageAlert: string | null;
  activeSearch: boolean;
  primaryColor: ColorChoice;
  logout: () => void;
  setMessageAlert;
  toggleMenu: (otherPage?: string | undefined) => void;
}

const MobileListMenu: React.FC<IMobileListMenu> = ({
  primaryColor,
  click,
  logout,
  activeSearch,
  toggleMenu,
  messageAlert,
  setMessageAlert
}) => {
  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUserAddress) {
      dispatch({ type: 'GET_USER_START', publicAddress: currentUserAddress });
    }
  }, [currentUserAddress, dispatch]);

  return (
    <List primaryColor={primaryColor} click={click}>
      <div>
        {activeSearch && (
          <SearchInputMobile primaryColor={primaryColor}>
            <i className="fas fa-search" aria-hidden="true"></i>
            <input
              className={
                primaryColor === 'rhyno' ? 'rhyno' : 'input-search-black'
              }
              type="text"
              placeholder="Search the rairverse..."
            />
          </SearchInputMobile>
        )}
        <MobileNavigationList
          messageAlert={messageAlert}
          setMessageAlert={setMessageAlert}
          primaryColor={primaryColor}
          toggleMenu={toggleMenu}
          currentUserAddress={currentUserAddress}
          logout={logout}
        />
      </div>
      {/* <ListItem primaryColor={primaryColor}>
        <a href="https://rair.tech/" target="_blank" rel="noreferrer">
          RAIR TECH
        </a>
      </ListItem> */}
      {/* <ListItem primaryColor={primaryColor}>
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
      </ListItem> */}
      {/* {!loginDone && !adminRights === true && !creatorViewsDisabled ? (
        [
          {
            name: <i className="fas fa-photo-video" />,
            route: '/all',
            disabled: !loginDone
          },
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
      )} */}
      <CommunityBlock primaryColor={primaryColor}>
        <div className="community-text">Join our community</div>
        <CommunityBoxFooter className="header-mobile-community">
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
    </List>
  );
};

export default MobileListMenu;
