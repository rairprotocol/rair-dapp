import { useState } from 'react';
import { faCheck, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormControl from '@mui/material/FormControl';
// import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { useAppSelector } from '../../../../hooks/useReduxHooks';
// imports image logos
import {
  Curios,
  Dapper,
  MinTable,
  OneOf,
  OpenSea,
  RairLogoBlue,
  Rarible
} from '../../../../images';
import { ImageLazy } from '../../../MockUpPage/ImageLazy/ImageLazy';

import CompareMobileSelect from './CompareMobileSelect/CompareMobileSelect';

const CompareAbout = () => {
  const [categories, setCategories] = useState<number>(10);
  const { iconColor } = useAppSelector((store) => store.colors);

  const handleChange = (event) => {
    setCategories(event.target.value);
  };

  return (
    <>
      <div className="about-compare-mobile">
        <div className="about-compare-title">Compare</div>
        <FormControl
          className="about-form-controll-compare"
          sx={{ m: 1, minWidth: 120 }}>
          <Select
            displayEmpty
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={categories}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'Without label' }}>
            <MenuItem value={10}>Storefront</MenuItem>
            <MenuItem value={20}>EVM Support</MenuItem>
            <MenuItem value={30}>Royalties</MenuItem>
            <MenuItem value={40}>Metadata</MenuItem>
            <MenuItem value={50}>Streaming</MenuItem>
          </Select>
        </FormControl>
        <CompareMobileSelect categories={categories} />
      </div>
      <div className="about-compare">
        <div className="about-compare-title">Compare</div>
        <div className="about-compare-content">
          <div className="table-compare-container">
            <div className="table-compare-title-element">Platform</div>
            <div className="table-compare-title-element">Storefront</div>
            <div className="table-compare-title-element">EVM Support</div>
            <div className="table-compare-title-element">Royalties</div>
            <div className="table-compare-title-element">Metadata</div>
            <div>Streaming</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>
                  <div className="circle-table-img">
                    <div className="img_wrapper">
                      <ImageLazy src={RairLogoBlue} alt="Rair Tech" />
                    </div>
                    <span>Rair.tech</span>
                  </div>
                </th>
                <th>Metaverse as-a-Service</th>
                <th>Any EVM</th>
                <th>Universal Onchain</th>
                <th>Provenance & Speed</th>
                <th>
                  {' '}
                  <div className="circle-table">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="fas_custom_main"
                      style={{ color: iconColor }}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="circle-table-img">
                    <div className="img_wrapper">
                      <ImageLazy src={OpenSea} alt="OpenSea" />
                    </div>
                    <span>Opensea</span>
                  </div>
                </td>
                <td>Just another Opensea page</td>
                <td>Limited EVMs</td>
                <td>2.5% Offchain</td>
                <td>Lazyminted</td>
                <td>
                  {' '}
                  <div className="circle-table">
                    <FontAwesomeIcon icon={faMinus} className="fas_custom" />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="circle-table-img">
                    <div className="img_wrapper">
                      <ImageLazy src={Rarible} alt="Rarible" />
                    </div>
                    <span>Rarible</span>
                  </div>
                </td>
                <td>Just another Rarible page</td>
                <td>ETH only</td>
                <td>2.5% Offchain</td>
                <td>Lazyminted</td>
                <td>
                  <div className="circle-table">
                    <FontAwesomeIcon icon={faMinus} className="fas_custom" />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="circle-table-img">
                    <div className="img_wrapper">
                      <ImageLazy src={OneOf} alt="Oneof" />
                    </div>
                    <span>Oneof</span>
                  </div>
                </td>
                <td>Not your brand</td>
                <td>Only Tezos</td>
                <td>Stuck on Tezos</td>
                <td>Stuck on Tezos</td>
                <td>
                  <div className="circle-table">
                    <FontAwesomeIcon icon={faMinus} className="fas_custom" />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="circle-table-img">
                    <div className="img_wrapper">
                      <ImageLazy src={Dapper} alt="Dapper" />
                    </div>
                    <span>Dapper</span>
                  </div>
                </td>
                <td>Need flow devs</td>
                <td>Only Flow</td>
                <td>Stuck on Flow</td>
                <td>Stuck on Flow</td>
                <td>
                  <div className="circle-table">
                    <FontAwesomeIcon icon={faMinus} className="fas_custom" />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="circle-table-img">
                    <div className="img_wrapper">
                      <ImageLazy src={MinTable} alt="Mintable App" />
                    </div>
                    <span>Mintable</span>
                  </div>
                </td>
                <td>Just another Mintable page</td>
                <td>ETH</td>
                <td>5%</td>
                <td>Lazyminted</td>
                <td>
                  <div className="circle-table">
                    <FontAwesomeIcon icon={faMinus} className="fas_custom" />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="circle-table-img">
                    <div className="img_wrapper">
                      <ImageLazy src={Curios} alt="LooksRare" />
                    </div>
                    <span>LooksRare</span>
                  </div>
                </td>
                <td>Opensea clone</td>
                <td>MATIC</td>
                <td>2.5%</td>
                <td>Lazyminted</td>
                <td>
                  <div className="circle-table">
                    <FontAwesomeIcon icon={faMinus} className="fas_custom" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CompareAbout;
