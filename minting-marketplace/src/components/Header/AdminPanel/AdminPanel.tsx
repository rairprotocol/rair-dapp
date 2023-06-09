import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Popup from 'reactjs-popup';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import { TUsersInitialState } from '../../../ducks/users/users.types';

const AdminPanel = ({ creatorViewsDisabled, adminPanel, setAdminPanel }) => {
  const { minterInstance, diamondMarketplaceInstance, factoryInstance } =
    useSelector<RootState, ContractsInitialType>(
      (store) => store.contractStore
    );
  const { adminRights, loggedIn } = useSelector<RootState, TUsersInitialState>(
    (store) => store.userStore
  );
  const { primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  return (
    <>
      <Popup
        className="popup-admin-panel"
        open={adminPanel}
        closeOnDocumentClick
        onClose={() => setAdminPanel(false)}>
        <div className="container-admin-panel">
          {adminPanel &&
            adminRights === true &&
            !creatorViewsDisabled &&
            [
              {
                name: <i className="fas fa-photo-video" />,
                route: '/all',
                disabled: !loggedIn
              },
              {
                name: <i className="fa fa-shopping-cart" aria-hidden="true" />,
                route: '/resale-offers',
                disabled: !loggedIn
              },
              {
                name: <i className="fa fa-shopping-cart" aria-hidden="true" />,
                route: '/on-sale',
                disabled: !loggedIn
              },
              {
                name: <i className="fa fa-user-secret" aria-hidden="true" />,
                route: '/admin/fileUpload',
                disabled: !loggedIn
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
                disabled: !loggedIn
              },
              {
                name: <i className="fas fa-file-import" />,
                route: '/importExternalContracts',
                disabled: !loggedIn
              }
            ].map((item, index) => {
              if (!item.disabled) {
                return (
                  <div
                    key={index}
                    className={`col-12 py-3 btn-${primaryColor}`}>
                    <NavLink
                      className={({ isActive }) => {
                        return `py-3 ${
                          isActive ? `active-${primaryColor}` : ''
                        }`;
                      }}
                      to={item.route}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                      onClick={() => {
                        setAdminPanel(false);
                      }}>
                      {item.name}
                    </NavLink>
                  </div>
                );
              }
              return <div key={index}></div>;
            })}
        </div>
      </Popup>
    </>
  );
};

export default AdminPanel;
