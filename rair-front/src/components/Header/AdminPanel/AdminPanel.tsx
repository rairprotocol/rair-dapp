import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Popup from 'reactjs-popup';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import { TUsersInitialState } from '../../../ducks/users/users.types';
import { TooltipBox } from '../../common/Tooltip/TooltipBox';

const AdminPanel = ({ creatorViewsDisabled, adminPanel, setAdminPanel }) => {
  const { minterInstance, diamondMarketplaceInstance, factoryInstance } =
    useSelector<RootState, ContractsInitialType>(
      (store) => store.contractStore
    );
  const { adminRights, loggedIn } = useSelector<RootState, TUsersInitialState>(
    (store) => store.userStore
  );
  const { primaryColor, secondaryColor, textColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  return (
    <>
      <Popup
        className="popup-admin-panel"
        open={adminPanel}
        closeOnDocumentClick
        onClose={() => setAdminPanel(false)}>
        <div
          style={{
            backgroundColor: primaryColor
          }}
          className="container-admin-panel">
          {
          adminPanel &&
            adminRights === true &&
            !creatorViewsDisabled &&
            [
              {
                name: <TooltipBox position={'top'} title="Server Settings"> <div>
                  <i className="fa fa-cog" aria-hidden="true" /></div></TooltipBox>,
                route: '/admin/fileUpload',
                disabled: !loggedIn
              },
              // {
              //   name: <TooltipBox position={'top'} title="Imprort / Export"><div><i className="fas fa-exchange"></i></div></TooltipBox>,
              //   route: '/importExternalContracts',
              //   disabled: !loggedIn
              // },
              {
                name:  <TooltipBox position={'top'} title="Import / Export / Transfer"><div><i className="fas fa-city" /></div></TooltipBox>,
                route: '/admin/transferNFTs',
                disabled: factoryInstance === undefined
              },
              {
                name:  <TooltipBox position={'top'} title="Streaming">
                <div style={{width: "70px"}}><i className="fas fa-film" /></div>
              </TooltipBox>,
                route: '/user/videos',
                disabled: !loggedIn
              },
              {
                name: <TooltipBox position={'top'} title="Old Market (diamond)">
                <div style={{width: "70px"}}><i className="fas fa-gem" /></div>
              </TooltipBox>,
                route: '/diamondMinter',
                disabled: diamondMarketplaceInstance === undefined
              },
              {
                name: <TooltipBox position={'top'} title="Old Market (classic)">
                  <div style={{width: "70px"}}><i className="fa fa-shopping-cart" aria-hidden="true" /></div>
                </TooltipBox>,
                route: '/on-sale',
                disabled: !loggedIn
              },
            ].map((item, index) => {
              if (!item.disabled) {
                return (
                  <div
                    key={index}
                    style={{ color: textColor }}
                    className={`col-12 py-3 btn-light`}>
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