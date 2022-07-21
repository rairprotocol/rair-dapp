import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import { INavigatorFactory } from './creatorStudio.types';

const NavigatorFactory: React.FC<INavigatorFactory> = ({ children }) => {
  const { factoryInstance } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );
  const { primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );
  return (
    <div className="row px-0 mx-0">
      <div className="col-xl-3 col-lg-1 col-md-1 d-none d-md-inline-block" />
      <div
        className={`col bg-${primaryColor} rounded-lg py-5`}
        style={{
          color: `var(--charcoal${primaryColor === 'rhyno' ? '' : '-40'})`
        }}>
        <h5>Factory</h5>
        <span>{factoryInstance?.address}</span>
        <div className="row">
          <div className="col-6 p-2">
            <NavLink
              className={({ isActive }) => {
                return `btn btn-${
                  isActive ? 'stimorol' : primaryColor
                } w-100 rounded-rair`;
              }}
              to="/creator/deploy">
              Deploy
            </NavLink>
          </div>
          <div className="col-6 p-2">
            <NavLink
              className={({ isActive }) => {
                return `btn btn-${
                  isActive ? 'stimorol' : primaryColor
                } w-100 rounded-rair`;
              }}
              to="/creator/contracts">
              My Contracts
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
