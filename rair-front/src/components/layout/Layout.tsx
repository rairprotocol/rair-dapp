import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ILayout } from './layout.types';

import { RootState } from '../../ducks';
import { TUsersInitialState } from '../../ducks/users/users.types';
import useConnectUser from '../../hooks/useConnectUser';
import { metaMaskIcon } from '../../images';
import { headerLogoBlackMobile } from '../../images';

import './Layout.css';

const Layout: React.FC<ILayout> = ({
  account,
  contractAddresses,
  chainId,
  children
}) => {
  const { connectUserData } = useConnectUser();
  const { userData } = useSelector<RootState, TUsersInitialState>(
    (store) => store.userStore
  );
  const items = [
    { name: <FontAwesomeIcon icon={faSearch} />, route: '/search' },
    { name: <FontAwesomeIcon icon={faUser} />, route: '/user' },
    { name: 'For Sale', route: '/on-sale' },
    { name: 'Admin', route: '/admin/fileUpload' },
    { name: 'All', route: '/all' },
    { name: 'Latest', route: '/latest' },
    { name: 'Hot', route: '/hot' },
    { name: 'Ending', route: '/ending' },
    { name: 'Batch Metadata', route: '/create-batch-metadata' },
    {
      name: 'Factory',
      route: '/factory',
      disabled: contractAddresses[chainId] === undefined
    },
    {
      name: 'Minter Marketplace',
      route: '/minter',
      disabled: contractAddresses[chainId] === undefined
    }
  ];
  return (
    <div
      style={{
        width: '90%',
        display: 'flex',
        height: '100vh',
        flexDirection: 'row',
        justifyContent: 'center'
      }}>
      <div className="rounded menu">
        <div
          className="col-12 pt-2 mb-4"
          style={{ height: '8vh', marginTop: '30px' }}>
          <img
            src={headerLogoBlackMobile}
            className="h-100"
            alt="Rair Tech Logo"
          />
        </div>
        {!userData && account ? (
          <button className="btn btn-light" onClick={() => connectUserData()}>
            Connect <img src={metaMaskIcon} alt="Metamask Logo" />
          </button>
        ) : (
          <div className="menu">
            {items.map((item, index) => (
              <Link
                key={index}
                to={item.route}
                style={{
                  width: '120px',
                  padding: '10px',
                  color: 'inherit',
                  textDecoration: 'none'
                }}>
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
      <div
        style={{
          width: '85%',
          height: '100%',
          margin: 'auto',
          overflow: 'auto'
        }}
        className="children">
        {children}
      </div>
    </div>
  );
};

export default Layout;
