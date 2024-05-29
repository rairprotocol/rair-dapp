import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { INavigatorContract } from './creatorStudio.types';

import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';

const NavigatorContract: React.FC<INavigatorContract> = ({
  children,
  contractAddress,
  contractName,
  contractBlockchain
}) => {
  const { primaryColor, textColor, primaryButtonColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);
  return (
    <div className="row px-0 mx-0">
      <div className="col-xl-3 col-lg-1 col-md-1 d-none d-md-inline-block" />
      <div
        className={`col ${
          primaryColor === 'rhyno' ? 'bg' : `bg-${primaryColor}`
        } rounded-lg py-5`}
        style={{
          color: `var(--charcoal${primaryColor === 'rhyno' ? '' : '-40'})`
        }}>
        <h5 style={{ color: textColor }}>
          <b>{contractName}</b>
        </h5>
        <small>{contractAddress}</small>
        <div className="row">
          <div className="col-6 p-2">
            <NavLink
              style={({ isActive }) => ({
                color: textColor,
                background: isActive ? primaryButtonColor : primaryColor,
                border: `solid 1px ${textColor}`
              })}
              className="btn rair-button w-100 rounded-rair"
              to={`/creator/contract/${contractBlockchain}/${contractAddress}/createCollection`}>
              Create New Collection
            </NavLink>
          </div>
          <div className="col-6 p-2">
            <NavLink
              style={({ isActive }) => ({
                color: textColor,
                background: isActive ? primaryButtonColor : primaryColor,
                border: `solid 1px ${textColor}`
              })}
              className="btn rair-button w-100 rounded-rair"
              to={`/creator/contract/${contractBlockchain}/${contractAddress}/listCollections`}>
              Existing Collections
            </NavLink>
          </div>
        </div>
        <div className="row">{children}</div>
      </div>
      <div className="col-xl-3 col-lg-1 col-md-1 d-none d-md-inline-block" />
    </div>
  );
};

export default NavigatorContract;
