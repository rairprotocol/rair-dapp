import React from 'react';
import { faCheck, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  Curios,
  Dapper,
  MinTable,
  OneOf,
  OpenSea,
  RairLogoBlue,
  Rarible
} from '../../../../../images';
import { ImageLazy } from '../../../../MockUpPage/ImageLazy/ImageLazy';
import { ICompareMobileSelect } from '../../aboutPage.types';

const CompareMobileSelect: React.FC<ICompareMobileSelect> = ({
  categories
}) => {
  return (
    <div className="compare-select-mobile-container">
      {categories === 10 && (
        <div className="compare-mobile-deployment">
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={RairLogoBlue} alt="Rair Tech" />
              </div>
            </div>
            <div className="select-mobile-text">Metaverse as-a-Service</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={OpenSea} alt="OpenSea" />
              </div>
            </div>
            <div className="select-mobile-text">Just another Opensea page</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={Rarible} alt="Rarible" />
              </div>
            </div>
            <div className="select-mobile-text">Just another Rarible page</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={OneOf} alt="OneOf" />
              </div>
            </div>
            <div className="select-mobile-text">Not your brand</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={Dapper} alt="Dapper" />
              </div>
            </div>
            <div className="select-mobile-text">Need flow devs</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={MinTable} alt="Mintable App" />
              </div>
            </div>
            <div className="select-mobile-text">Just another Mintable page</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={Curios} alt="Curios" />
              </div>
            </div>
            <div className="select-mobile-text">Curios backend..</div>
          </div>
        </div>
      )}
      {categories === 20 && (
        <div className="compare-mobile-deployment">
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={RairLogoBlue} alt="Rair Tech" />
              </div>
            </div>
            <div className="select-mobile-text">Any EVM</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={OpenSea} alt="OpenSea" />
              </div>
            </div>
            <div className="select-mobile-text">Limited EVMs</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={Rarible} alt="Rarible" />
              </div>
            </div>
            <div className="select-mobile-text">ETH only</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={OneOf} alt="OneOf" />
              </div>
            </div>
            <div className="select-mobile-text">Only Tezos</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={Dapper} alt="Dapper" />
              </div>
            </div>
            <div className="select-mobile-text">Only Flow</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={MinTable} alt="Mintable App" />
              </div>
            </div>
            <div className="select-mobile-text">ETH</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={Curios} alt="Curios" />
              </div>
            </div>
            <div className="select-mobile-text">MATIC</div>
          </div>
        </div>
      )}
      {categories === 30 && (
        <div className="compare-mobile-deployment">
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={RairLogoBlue} alt="Rair Tech" />
              </div>
            </div>
            <div className="select-mobile-text">Universal Onchain</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={OpenSea} alt="OpenSea" />
              </div>
            </div>
            <div className="select-mobile-text">2.5% Offchain</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={Rarible} alt="Rarible" />
              </div>
            </div>
            <div className="select-mobile-text">2.5% Offchain</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={OneOf} alt="OneOf" />
              </div>
            </div>
            <div className="select-mobile-text">Stuck on Tezos</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={Dapper} alt="Dapper" />
              </div>
            </div>
            <div className="select-mobile-text">Stuck on Flow</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={MinTable} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">5%</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={Curios} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">5% Offchain</div>
          </div>
        </div>
      )}
      {categories === 40 && (
        <div className="compare-mobile-deployment">
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={RairLogoBlue} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">Provenance & Speed</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={OpenSea} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">Lazyminted</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={Rarible} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">Lazyminted</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={OneOf} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">Stuck on Tezos</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={Dapper} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">Stuck on Tezos</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={MinTable} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">Lazyminted</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={Curios} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">Lazyminted</div>
          </div>
        </div>
      )}
      {categories === 50 && (
        <div className="compare-mobile-deployment">
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={RairLogoBlue} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">
              <div className="circle-table">
                <FontAwesomeIcon icon={faCheck} className="fas_custom_main" />
              </div>
            </div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={OpenSea} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">
              <div className="circle-table">
                <FontAwesomeIcon icon={faMinus} className="fas_custom" />
              </div>
            </div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={Rarible} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">
              <div className="circle-table">
                <FontAwesomeIcon icon={faMinus} className="fas_custom" />
              </div>
            </div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={OneOf} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">
              <div className="circle-table">
                <FontAwesomeIcon icon={faMinus} className="fas_custom" />
              </div>
            </div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={Dapper} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">
              <div className="circle-table">
                <FontAwesomeIcon icon={faMinus} className="fas_custom" />
              </div>
            </div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={MinTable} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">
              <div className="circle-table">
                <FontAwesomeIcon icon={faMinus} className="fas_custom" />
              </div>
            </div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <ImageLazy src={Curios} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">
              <div className="circle-table">
                <FontAwesomeIcon icon={faMinus} className="fas_custom" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareMobileSelect;
