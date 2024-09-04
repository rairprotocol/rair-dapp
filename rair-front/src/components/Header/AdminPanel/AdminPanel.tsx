import { NavLink } from 'react-router-dom';
import Popup from 'reactjs-popup';
import {
  faCity,
  faCog,
  faFilm,
  faGem,
  faIdCard,
  faShoppingCart
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useContracts from '../../../hooks/useContracts';
import { useAppSelector } from '../../../hooks/useReduxHooks';
import { TooltipBox } from '../../common/Tooltip/TooltipBox';

const AdminPanel = ({ creatorViewsDisabled, adminPanel, setAdminPanel }) => {
  const { diamondMarketplaceInstance } = useContracts();
  const { adminRights, superAdmin, isLoggedIn } = useAppSelector(
    (store) => store.user
  );
  const { primaryColor, textColor, iconColor } = useAppSelector(
    (store) => store.colors
  );

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
          {adminPanel &&
            (adminRights || superAdmin) &&
            !creatorViewsDisabled &&
            [
              {
                name: (
                  <TooltipBox position={'top'} title="Server Settings">
                    {' '}
                    <div>
                      <FontAwesomeIcon
                        style={{
                          color:
                            import.meta.env.VITE_TESTNET === 'true'
                              ? `${
                                  iconColor === '#1486c5'
                                    ? '#F95631'
                                    : iconColor
                                }`
                              : `${
                                  iconColor === '#1486c5'
                                    ? '#E882D5'
                                    : iconColor
                                }`
                        }}
                        icon={faCog}
                      />
                    </div>
                  </TooltipBox>
                ),
                route: '/admin/settings',
                disabled: !isLoggedIn
              },
              {
                name: (
                  <TooltipBox position={'top'} title="License">
                    {' '}
                    <div>
                      <FontAwesomeIcon
                        style={{
                          color:
                            import.meta.env.VITE_TESTNET === 'true'
                              ? `${
                                  iconColor === '#1486c5'
                                    ? '#F95631'
                                    : iconColor
                                }`
                              : `${
                                  iconColor === '#1486c5'
                                    ? '#E882D5'
                                    : iconColor
                                }`
                        }}
                        icon={faIdCard}
                      />
                    </div>
                  </TooltipBox>
                ),
                route: '/license',
                disabled: !isLoggedIn
              },
              {
                name: (
                  <TooltipBox
                    position={'top'}
                    title="Import / Export / Transfer">
                    <div>
                      <FontAwesomeIcon
                        style={{
                          color:
                            import.meta.env.VITE_TESTNET === 'true'
                              ? `${
                                  iconColor === '#1486c5'
                                    ? '#F95631'
                                    : iconColor
                                }`
                              : `${
                                  iconColor === '#1486c5'
                                    ? '#E882D5'
                                    : iconColor
                                }`
                        }}
                        icon={faCity}
                      />
                    </div>
                  </TooltipBox>
                ),
                route: '/admin/transferNFTs',
                disabled: !isLoggedIn
              },
              {
                name: (
                  <TooltipBox position={'top'} title="Streaming">
                    <div style={{ width: '70px' }}>
                      <FontAwesomeIcon
                        style={{
                          color:
                            import.meta.env.VITE_TESTNET === 'true'
                              ? `${
                                  iconColor === '#1486c5'
                                    ? '#F95631'
                                    : iconColor
                                }`
                              : `${
                                  iconColor === '#1486c5'
                                    ? '#E882D5'
                                    : iconColor
                                }`
                        }}
                        icon={faFilm}
                      />
                    </div>
                  </TooltipBox>
                ),
                route: '/user/videos',
                disabled: !isLoggedIn
              },
              {
                name: (
                  <TooltipBox position={'top'} title="Old Market (diamond)">
                    <div style={{ width: '70px' }}>
                      <FontAwesomeIcon
                        style={{
                          color:
                            import.meta.env.VITE_TESTNET === 'true'
                              ? `${
                                  iconColor === '#1486c5'
                                    ? '#F95631'
                                    : iconColor
                                }`
                              : `${
                                  iconColor === '#1486c5'
                                    ? '#E882D5'
                                    : iconColor
                                }`
                        }}
                        icon={faGem}
                      />
                    </div>
                  </TooltipBox>
                ),
                route: '/diamondMinter',
                disabled: diamondMarketplaceInstance === undefined
              },
              {
                name: (
                  <TooltipBox position={'top'} title="Old Market (classic)">
                    <div style={{ width: '70px' }}>
                      <FontAwesomeIcon
                        style={{
                          color:
                            import.meta.env.VITE_TESTNET === 'true'
                              ? `${
                                  iconColor === '#1486c5'
                                    ? '#F95631'
                                    : iconColor
                                }`
                              : `${
                                  iconColor === '#1486c5'
                                    ? '#E882D5'
                                    : iconColor
                                }`
                        }}
                        icon={faShoppingCart}
                      />
                    </div>
                  </TooltipBox>
                ),
                route: '/on-sale',
                disabled: !isLoggedIn
              }
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
