//@ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import MetamaskLogo from '../../images/metamask-fox.svg';
import headerLogo from '../../images/RAIR-Tech-Logo-POWERED BY-BLACK-2021.png';
import './Layout.css';
import { ILayout } from './layout.types';

const Layout: React.FC<ILayout> = (props) => {
  const { userData, account, connectUserData, contractAddresses, chainId } =
    props;
  const items = [
    { name: <i className="fas fa-search" />, route: '/search' },
    { name: <i className="fas fa-user" />, route: '/user' },
    { name: 'My NFTs', route: '/my-nft' },
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
          <img src={headerLogo} className="h-100" alt="header logo" />
        </div>
        {!userData && account ? (
          <button className="btn btn-light" onClick={connectUserData}>
            Connect <img src={MetamaskLogo} alt="metamask logo" />
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
        {props.children}
      </div>
    </div>
  );
};

export default Layout;
