import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { faArrowRight, faGem, faVial } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TContractsArray } from './creatorStudio.types';
import NavigatorFactory from './NavigatorFactory';

import { RootState } from '../../ducks';
import { getTokenError } from '../../ducks/auth/actions';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import chainData from '../../utils/blockchainData';
import { rFetch } from '../../utils/rFetch';
import setDocumentTitle from '../../utils/setTitle';
import { ContractType } from '../adminViews/adminView.types';
import InputField from '../common/InputField';

const Contracts = () => {
  const dispatch = useDispatch();
  const [titleSearch, setTitleSearch] = useState<string>('');
  const [contractArray, setContractArray] = useState<TContractsArray[]>();
  const [diamondFilter, setDiamondFilter] = useState<Boolean>(false);
  const [chainFilter, setChainFilter] = useState<string[]>([]);
  const { programmaticProvider } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );
  const {
    primaryColor,
    secondaryColor,
    textColor,
    primaryButtonColor,
    iconColor
  } = useSelector<RootState, ColorStoreType>((store) => store.colorStore);

  const fetchContracts = useCallback(async () => {
    const response = await rFetch('/api/contracts/factoryList', undefined, {
      provider: programmaticProvider
    });
    if (response.success) {
      setContractArray(
        response.contracts.map((item: ContractType) => ({
          address: item.contractAddress,
          name: item.title,
          blockchain: item.blockchain,
          diamond: item.diamond
        }))
      );
    }
    if (response.error && response.message) {
      dispatch(getTokenError(response.error));
    }
  }, [programmaticProvider, dispatch]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  useEffect(() => {
    setDocumentTitle(`Contracts`);
  }, []);
  return (
    <NavigatorFactory>
      {contractArray && contractArray.length > 0 && (
        <>
          <div className="col-12 search-contracts-factory">
            <InputField
              getter={titleSearch}
              setter={setTitleSearch}
              placeholder="Contract filter"
              customClass={`rounded-rair form-control contracts-filter-${primaryColor}`}
              customCSS={{
                backgroundColor: primaryColor,
                color: textColor ? textColor : 'inherit',
                borderColor: `var(--${secondaryColor}-40)`
              }}
              labelClass="text-start w-100"
            />
          </div>
          <div className="col-12">
            <button
              onClick={() => setDiamondFilter(!diamondFilter)}
              className={`col-xs-12 col-md-6 rair-rounded btn btn-${
                diamondFilter ? 'light' : 'outline-secondary'
              }`}>
              <FontAwesomeIcon icon={faGem} /> Only Diamonds
            </button>
            {Object.keys(chainData)
              .filter((chain) => chainData[chain].disabled !== true)
              .map((chain, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      const aux = [...chainFilter];
                      if (chainFilter.includes(chain)) {
                        aux.splice(aux.indexOf(chain), 1);
                      } else {
                        aux.push(chain);
                      }
                      setChainFilter(aux);
                    }}
                    className={`col-xs-12 col-md-6 rair-rounded btn btn-${
                      chainFilter.includes(chain)
                        ? 'light'
                        : 'outline-secondary'
                    }`}>
                    <img
                      alt={chainData[chain]?.name}
                      src={chainData[chain]?.image}
                      style={{ maxHeight: '1.5rem', maxWidth: '1.5rem' }}
                      className="me-2"
                    />
                    <small>{chainData[chain].name}</small>
                  </button>
                );
              })}
          </div>
        </>
      )}
      {contractArray ? (
        contractArray.length > 0 ? (
          contractArray
            .filter((item) => {
              if (
                titleSearch !== '' &&
                item.name &&
                !item.name.toLowerCase().includes(titleSearch.toLowerCase())
              ) {
                return false;
              }
              if (diamondFilter && !item.diamond) {
                return false;
              }
              if (
                chainFilter.length &&
                item.blockchain &&
                !chainFilter.includes(item.blockchain)
              ) {
                return false;
              }
              return true;
            })
            .map((item, index) => {
              return (
                <NavLink
                  to={`/creator/contract/${item.blockchain}/${item.address}/createCollection`}
                  key={index}
                  style={{
                    position: 'relative',
                    backgroundColor: `color-mix(in srgb, ${primaryColor}, #888888)`
                  }}
                  className={`col-12 btn btn-${primaryColor} text-start rounded-rair my-1`}>
                  {item?.blockchain && (
                    <abbr title={chainData[item.blockchain]?.name}>
                      <img
                        alt={chainData[item.blockchain]?.name}
                        src={chainData[item.blockchain]?.image}
                        style={{ maxHeight: '1.5rem', maxWidth: '1.5rem' }}
                        className="me-2"
                      />
                    </abbr>
                  )}
                  {item.diamond === true && (
                    <abbr title={'Diamond Contract'}>
                      <FontAwesomeIcon icon={faGem} className="me-2" />
                    </abbr>
                  )}
                  {item?.blockchain && chainData[item.blockchain]?.testnet && (
                    <abbr title={'Testnet Contract'}>
                      <FontAwesomeIcon icon={faVial} className="me-2" />
                    </abbr>
                  )}
                  {item.name}
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '10px',
                      color:
                        import.meta.env.VITE_TESTNET === 'true'
                          ? `${iconColor === '#1486c5' ? '#F95631' : iconColor}`
                          : `${iconColor === '#1486c5' ? '#E882D5' : iconColor}`
                    }}
                  />
                </NavLink>
              );
            })
        ) : (
          <div
            style={{
              border: `1.3px dashed color-mix(in srgb, ${primaryColor}, #888888)`
            }}
            className="rounded-rair p-5">
            <h5 className="mt-5">
              It seems, you have not deployed any contracts yet
            </h5>
            <NavLink
              to="/creator/deploy"
              style={{
                background: primaryButtonColor,
                color: textColor
              }}
              className="btn rair-button mb-5 mt-3">
              Deploy
            </NavLink>
          </div>
        )
      ) : (
        'Fetching data...'
      )}
      <hr />
    </NavigatorFactory>
  );
};

export default Contracts;
