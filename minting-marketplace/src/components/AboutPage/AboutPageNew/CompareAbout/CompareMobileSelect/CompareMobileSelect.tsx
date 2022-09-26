import React from 'react';
import {
  RairLogoBlue,
  OpenSea,
  Rarible,
  OneOf,
  Dapper,
  MinTable,
  Curios
} from '../../../../../images';
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
                <img src={RairLogoBlue} alt="Rair Tech" />
              </div>
            </div>
            <div className="select-mobile-text">Metaverse as-a-Service</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={OpenSea} alt="OpenSea" />
              </div>
            </div>
            <div className="select-mobile-text">Just another Opensea page</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={Rarible} alt="Rarible" />
              </div>
            </div>
            <div className="select-mobile-text">Just another Rarible page</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={OneOf} alt="OneOf" />
              </div>
            </div>
            <div className="select-mobile-text">Not your brand</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={Dapper} alt="Dapper" />
              </div>
            </div>
            <div className="select-mobile-text">Need flow devs</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={MinTable} alt="Mintable App" />
              </div>
            </div>
            <div className="select-mobile-text">Just another Mintable page</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={Curios} alt="Curios" />
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
                <img src={RairLogoBlue} alt="Rair Tech" />
              </div>
            </div>
            <div className="select-mobile-text">Any EVM</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={OpenSea} alt="OpenSea" />
              </div>
            </div>
            <div className="select-mobile-text">Limited EVMs</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={Rarible} alt="Rarible" />
              </div>
            </div>
            <div className="select-mobile-text">ETH only</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={OneOf} alt="OneOf" />
              </div>
            </div>
            <div className="select-mobile-text">Only Tezos</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={Dapper} alt="Dapper" />
              </div>
            </div>
            <div className="select-mobile-text">Only Flow</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={MinTable} alt="Mintable App" />
              </div>
            </div>
            <div className="select-mobile-text">ETH</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={Curios} alt="Curios" />
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
                <img src={RairLogoBlue} alt="Rair Tech" />
              </div>
            </div>
            <div className="select-mobile-text">Universal Onchain</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={OpenSea} alt="OpenSea" />
              </div>
            </div>
            <div className="select-mobile-text">2.5% Offchain</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={Rarible} alt="Rarible" />
              </div>
            </div>
            <div className="select-mobile-text">2.5% Offchain</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={OneOf} alt="OneOf" />
              </div>
            </div>
            <div className="select-mobile-text">Stuck on Tezos</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={Dapper} alt="Dapper" />
              </div>
            </div>
            <div className="select-mobile-text">Stuck on Flow</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={MinTable} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">5%</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={Curios} alt="rair tech" />
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
                <img src={RairLogoBlue} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">Provenance & Speed</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={OpenSea} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">Lazyminted</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={Rarible} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">Lazyminted</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={OneOf} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">Stuck on Tezos</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={Dapper} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">Stuck on Tezos</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={MinTable} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">Lazyminted</div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={Curios} alt="rair tech" />
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
                <img src={RairLogoBlue} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">
              <div className="circle-table">
                <i className="fas fa-check fas_custom_main"></i>
              </div>
            </div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={OpenSea} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">
              <div className="circle-table">
                <i className="fa fa-minus fas_custom fas_custom"></i>
              </div>
            </div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={Rarible} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">
              <div className="circle-table">
                <i className="fa fa-minus fas_custom fas_custom"></i>
              </div>
            </div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={OneOf} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">
              <div className="circle-table">
                <i className="fa fa-minus fas_custom fas_custom"></i>
              </div>
            </div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={Dapper} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">
              <div className="circle-table">
                <i className="fa fa-minus fas_custom fas_custom"></i>
              </div>
            </div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={MinTable} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">
              <div className="circle-table">
                <i className="fa fa-minus fas_custom fas_custom"></i>
              </div>
            </div>
          </div>
          <div className="block-logos-mobile">
            <div className="block-logo">
              <div>
                <img src={Curios} alt="rair tech" />
              </div>
            </div>
            <div className="select-mobile-text">
              <div className="circle-table">
                <i className="fa fa-minus fas_custom fas_custom"></i>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareMobileSelect;
