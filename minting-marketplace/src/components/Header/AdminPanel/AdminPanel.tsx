//@ts-nocheck
import React from 'react'
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Popup from 'reactjs-popup';

const AdminPanel = ({ loginDone, creatorViewsDisabled, adminPanel, setAdminPanel }) => {
    const {
        minterInstance,
        diamondMarketplaceInstance,
        factoryInstance
    } = useSelector(store => store.contractStore);
    const { adminRights } = useSelector(store => store.userStore);
    const { primaryColor } = useSelector(store => store.colorStore);

    return (
        <>
            <Popup
                className="popup-admin-panel"
                open={adminPanel}
                closeOnDocumentClick
                onClose={() => setAdminPanel(false)}
            >
                <div className="container-admin-panel">
                    {
                        adminPanel && adminRights === true && !creatorViewsDisabled && [
                            { name: <i className="fas fa-photo-video" />, route: '/all', disabled: !loginDone },
                            { name: <i className="fas fa-key" />, route: '/my-nft' },
                            { name: <i className="fa fa-id-card" aria-hidden="true" />, route: '/new-factory', disabled: !loginDone },
                            { name: <i className="fa fa-shopping-cart" aria-hidden="true" />, route: '/on-sale', disabled: !loginDone },
                            { name: <i className="fa fa-user-secret" aria-hidden="true" />, route: '/admin', disabled: !loginDone },
                            { name: <i className="fas fa-city" />, route: '/factory', disabled: factoryInstance === undefined },
                            { name: <i className="fas fa-shopping-basket" />, route: '/minter', disabled: minterInstance === undefined },
                            { name: <i className="fas fa-gem" />, route: '/diamondMinter', disabled: diamondMarketplaceInstance === undefined },
                            { name: <i className="fas fa-exchange" />, route: '/admin/transferNFTs', disabled: !loginDone },
                            { name: <i className="fas fa-file-import" />, route: '/importExternalContracts', disabled: !loginDone }
                        ].map((item, index) => {
                            if (!item.disabled) {
                                return <div key={index} className={`col-12 py-3 btn-${primaryColor}`}>
                                    <NavLink activeClassName={`active-${primaryColor}`} className='py-3' to={item.route} style={{ color: 'inherit', textDecoration: 'none' }}
                                        onClick={() => { setAdminPanel(false) }}
                                    >
                                        {item.name}
                                    </NavLink>
                                </div>
                            }
                            return <div key={index}></div>
                        })
                    }
                </div>
            </Popup>
        </>
    )
}

export default AdminPanel