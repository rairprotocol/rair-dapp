import React from 'react';
import { NavLink } from 'react-router-dom';

import { INavigatorFactory } from './creatorStudio.types';

import { useAppSelector } from '../../hooks/useReduxHooks';
import useServerSettings from '../../hooks/useServerSettings';

const NavigatorFactory: React.FC<INavigatorFactory> = ({ children }) => {
  const { getBlockchainData } = useServerSettings();
  const { connectedChain } = useAppSelector((store) => store.web3);
  const { primaryColor, textColor, primaryButtonColor } = useAppSelector(
    (store) => store.colors
  );
  return (
    <div className="row px-0 mx-0">
      <div className="col-xl-3 col-lg-1 col-md-1 d-none d-md-inline-block" />
      <div
        className={`col rounded-lg py-5`}
        style={{
          color: textColor
        }}>
        <h5>Create with RAIR</h5>
        <span>{getBlockchainData(connectedChain)?.classicFactoryAddress}</span>
        <div className="row">
          <div className="col-6 p-2">
            <NavLink
              style={({ isActive }) => ({
                color: textColor,
                background: isActive ? primaryButtonColor : primaryColor,
                border: `solid 1px ${textColor}`
              })}
              className="btn rair-button w-100 rounded-rair"
              to="/creator/deploy">
              Deploy a Contract
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
              to="/creator/contracts">
              Deployed Contracts
            </NavLink>
          </div>
        </div>
        <div className="row">{children}</div>
      </div>
      <div className="col-xl-3 col-lg-1 col-md-1 d-none d-md-inline-block" />
    </div>
  );
};

export default NavigatorFactory;
