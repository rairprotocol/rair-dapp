
import React, { useState } from "react";

// imports image logos
import RairLogo from "../../assets/rairLogo_blue.png";
import OpenSea from "../../assets/openSea-logo.png";
import Rarible from "../../assets/rarible-logo.png";
import OneOf from "../../assets/oneOf-logo.png";
import Dapper from "../../assets/dapper-logo.png";
import MinTable from "../../assets/mintable-logo.png";
import Curios from "../../assets/curios.png";

// import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CompareMobileSelect from "./CompareMobileSelect/CompareMobileSelect";

const CompareAbout = () => {
  const [categories, setCategories] = useState<number>(10);

  const handleChange = (event) => {
    setCategories(event.target.value);
  };

  return (
    <>
      <div className="about-compare-mobile">
        <div className="about-compare-title">Compare</div>
        <FormControl sx={{ m: 1, minWidth: 120 }}  style={{ width: "400px" }}>
          <Select
          displayEmpty
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={categories}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'Without label' }}
          >
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
          <div className="table-compare-container" style={{
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'space-between',
            width: "102%",
            alignItems: 'space-between',
            flexWrap: 'wrap',
            padding: '5px 0px',
          }}>
            <div style={{ marginLeft: '14px' }}>Platform</div>
            <div style={{ marginLeft: '15px' }}>Storefront</div>
            <div style={{ paddingLeft: '89px' }}>EVM Support</div>
            <div style={{}}>Royalties</div>
            <div style={{ marginRight: '15px' }}>Metadata</div>
            <div >Streaming</div>
          </div>
          <table>
            <thead>
              <tr>
                <th><div className="circle-table-img">
                  <div className="img_wrapper">
                    <img style={{ width: "20px" }} src={RairLogo} alt="" />
                  </div>
                  <span style={{ paddingLeft: "15px" }}>Rair.tech</span>
                </div>
                </th>
                <th>Metaverse as-a-Service</th>
                <th>Any EVM</th>
                <th>Universal Onchain</th>
                <th>Provenance & Speed</th>
                <th> <div className="circle-table">
                  <i className="fas fa-check fas_custom_main"></i>
                </div></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="circle-table-img">
                    <div className="img_wrapper">
                      <img style={{ width: "20px" }} src={OpenSea} alt="" />
                    </div>
                    <span style={{ paddingLeft: "15px" }}>Opensea</span>
                  </div>
                </td>
                <td>Just another Opensea page</td>
                <td>Limited EVMs</td>
                <td>2.5% Offchain</td>
                <td>Lazyminted</td>
                <td>
                  {" "}
                  <div className="circle-table">
                    <i className="fa fa-minus fas_custom fas_custom"></i>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="circle-table-img">
                    <div className="img_wrapper">
                      <img style={{ width: "20px" }} src={Rarible} alt="" />
                    </div>
                    <span style={{ paddingLeft: "15px" }}>Rarible</span>
                  </div>
                </td>
                <td>Just another Rarible page</td>
                <td>ETH only</td>
                <td>2.5% Offchain</td>
                <td>Lazyminted</td>
                <td>
                  <div className="circle-table">
                    <i className="fa fa-minus fas_custom fas_custom"></i>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="circle-table-img">
                    <div className="img_wrapper">
                      <img style={{ width: "20px" }} src={OneOf} alt="" />
                    </div>
                    <span style={{ paddingLeft: "15px" }}>Oneof</span>
                  </div>
                </td>
                <td>Not your brand</td>
                <td>Only Tezos</td>
                <td>Stuck on Tezos</td>
                <td>Stuck on Tezos</td>
                <td>
                  <div className="circle-table">
                    <i className="fa fa-minus fas_custom fas_custom"></i>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="circle-table-img">
                    <div className="img_wrapper">
                      <img style={{ width: "20px" }} src={Dapper} alt="" />
                    </div>
                    <span style={{ paddingLeft: "15px" }}>Dapper</span>
                  </div>
                </td>
                <td>Need flow devs</td>
                <td>Only Flow</td>
                <td>Stuck on Flow</td>
                <td>Stuck on Flow</td>
                <td>
                  <div className="circle-table">
                    <i className="fa fa-minus fas_custom fas_custom"></i>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="circle-table-img">
                    <div className="img_wrapper">
                      <img style={{ width: "20px" }} src={MinTable} alt="" />
                    </div>
                    <span style={{ paddingLeft: "15px" }}>Mintable</span>
                  </div>
                </td>
                <td>Just another Mintable page</td>
                <td>ETH</td>
                <td>5%</td>
                <td>Lazyminted</td>
                <td>
                  <div className="circle-table">
                    <i className="fa fa-minus fas_custom fas_custom"></i>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="circle-table-img">
                    <div className="img_wrapper">
                      <img style={{ width: "20px" }} src={Curios} alt="" />
                    </div>
                    <span style={{ paddingLeft: "15px" }}>LooksRare</span>
                  </div>
                </td>
                <td>Opensea clone</td>
                <td>MATIC</td>
                <td>2.5%</td>
                <td>Lazyminted</td>
                <td>
                  <div className="circle-table">
                    <i className="fa fa-minus fas_custom fas_custom"></i>
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
