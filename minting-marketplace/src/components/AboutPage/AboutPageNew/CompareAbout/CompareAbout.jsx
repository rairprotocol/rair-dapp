import React from "react";

// imports image logos
import RairLogo from "../../assets/rairLogo_blue.png";
import OpenSea from "../../assets/openSea-logo.png";
import Rarible from "../../assets/rarible-logo.png";
import OneOf from "../../assets/oneOf-logo.png";
import Dapper from "../../assets/dapper-logo.png";
import MinTable from "../../assets/mintable-logo.png";
import Curios from "../../assets/curios.png";

const CompareAbout = () => {
  return (
    <>
      <div className="about-compare-mobile">
        <div className="about-compare-title">Compare</div>
        <div className="compare-container-mobile">
          <div className="about-compare-title-main-mobile">
            <div className="mobile-title-compare">Platform</div>
            <div className="mobile-title-compare">Whitelabel</div>
            <div className="mobile-title-compare">EVM Support</div>
          </div>
          <div className="compare-content-mobile">
            <div className="about-compare-mobile-icons">
              <div className="circle-table-img">
                <img src={RairLogo} alt="rair tech" />
              </div>
              <div className="circle-table-img">
                <img src={OpenSea} alt="OpenSea" />
              </div>
              <div className="circle-table-img">
                <img src={Rarible} alt="Rarible" />
              </div>
              <div className="circle-table-img">
                <img src={OneOf} alt="OneOf" />
              </div>
              <div className="circle-table-img">
                <img src={Dapper} alt="Dapper" />
              </div>
              <div className="circle-table-img">
                <img src={MinTable} alt="MinTable" />
              </div>
              <div className="circle-table-img">
                <img src={Curios} alt="Curios" />
              </div>
            </div>
            <div className="about-compare-content-mobile-text">
              <div className="block-content-mobile">
                <div>Metaverse as-a-Service</div>
                <div>Any EVM</div>
              </div>
              <div className="block-content-mobile">
                <div>Just another Opensea Page</div>
                <div>Limited EVMs</div>
              </div>
              <div className="block-content-mobile">
                <div>Just another Rarible Page</div>
                <div>ETH Only</div>
              </div>
              <div className="block-content-mobile">
                <div>Not your Brand</div>
                <div>Only Tezos</div>
              </div>
              <div className="block-content-mobile">
                <div>Need Flow devs</div>
                <div>Only Flow</div>
              </div>
              <div className="block-content-mobile">
                <div>Just another Mintable Page</div>
                <div>ETH</div>
              </div>
              <div className="block-content-mobile">
                <div>Curios Backend</div>
                <div>MATIC</div>
              </div>
            </div>
          </div>
        </div>
        <div className="compare-container-mobile">
          <div className="about-compare-title-main-mobile">
            <div className="mobile-title-compare">Platform</div>
            <div className="mobile-title-compare">Royalties</div>
            <div className="mobile-title-compare">Metadata</div>
          </div>
          <div className="compare-content-mobile">
            <div className="about-compare-mobile-icons">
              <div className="circle-table-img">
                <img src={RairLogo} alt="rair tech" />
              </div>
              <div className="circle-table-img">
                <img src={OpenSea} alt="OpenSea" />
              </div>
              <div className="circle-table-img">
                <img src={Rarible} alt="Rarible" />
              </div>
              <div className="circle-table-img">
                <img src={OneOf} alt="OneOf" />
              </div>
              <div className="circle-table-img">
                <img src={Dapper} alt="Dapper" />
              </div>
              <div className="circle-table-img">
                <img src={MinTable} alt="MinTable" />
              </div>
              <div className="circle-table-img">
                <img src={Curios} alt="Curios" />
              </div>
            </div>
            <div className="about-compare-content-mobile-text">
              <div className="block-content-mobile">
                <div>Universal Onchain</div>
                <div>Provenance & Speed</div>
              </div>
              <div className="block-content-mobile">
                <div>2.5% Offchain</div>
                <div>Lazyminted</div>
              </div>
              <div className="block-content-mobile">
                <div>2.5% Offchain</div>
                <div>Lazyminted</div>
              </div>
              <div className="block-content-mobile">
                <div>Stuck on Tezos</div>
                <div>Stuck on Tezos</div>
              </div>
              <div className="block-content-mobile">
                <div>Stuck on Flow</div>
                <div>Stuck on Flow</div>
              </div>
              <div className="block-content-mobile">
                <div>5%</div>
                <div>Lazyminted</div>
              </div>
              <div className="block-content-mobile">
                <div>5% Offchain</div>
                <div>Lazyminted</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="about-compare">
        <div className="about-compare-title">Compare</div>
        <div className="about-compare-content">
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'space-between',
            width: "102%",
            alignItems: 'space-between',
            flexWrap: 'wrap',
            padding: '5px 0px',
        }}>
              <div  style={{ marginLeft: '14px' }}>Platform</div>
              <div style={{ marginLeft: '15px' }}>Whitelabel</div>
              <div style={{ paddingLeft: '89px' }}>EVM Support</div>
              <div style={{ }}>Royalties</div>
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
                  <span style={{ paddingLeft: "15px" }}>Curious</span>
                </div>
              </td>
              <td>Curios backend..</td>
              <td>MATIC</td>
              <td>5% Offchain</td>
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
