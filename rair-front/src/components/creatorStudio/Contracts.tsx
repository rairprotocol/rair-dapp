//@ts-nocheck
import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  faArrowRight,
  faEyeSlash,
  faGem,
  faLinkSlash,
  faVial,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Hex } from "viem";

import NavigatorFactory from "./NavigatorFactory";

import { useAppSelector } from "../../hooks/useReduxHooks";
import useServerSettings from "../../hooks/useServerSettings";
import { Contract } from "../../types/databaseTypes";
import { rFetch } from "../../utils/rFetch";
import setDocumentTitle from "../../utils/setTitle";
import InputField from "../common/InputField";

const Contracts = () => {
  const [titleSearch, setTitleSearch] = useState<string>("");
  const [contractArray, setContractArray] = useState<Array<Contract>>([]);
  const [diamondFilter, setDiamondFilter] = useState<Boolean>(false);
  const [chainFilter, setChainFilter] = useState<Hex[]>([]);
  const { programmaticProvider } = useAppSelector((store) => store.web3);
  const {
    primaryColor,
    secondaryColor,
    textColor,
    primaryButtonColor,
    iconColor,
  } = useAppSelector((store) => store.colors);

  const { blockchainSettings } = useAppSelector((store) => store.settings);
  const { getBlockchainData } = useServerSettings();

  const fetchContracts = useCallback(async () => {
    const response = await rFetch("/api/contracts/factoryList", undefined, {
      provider: programmaticProvider,
    });
    if (response.success) {
      setContractArray(response.contracts);
    }
  }, [programmaticProvider]);

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
                color: textColor ? textColor : "inherit",
                borderColor: `var(--${secondaryColor}-40)`,
              }}
              labelClass="text-start w-100"
            />
          </div>
          <div className="col-12">
            <button
              onClick={() => setDiamondFilter(!diamondFilter)}
              className={`col-xs-12 col-md-6 rair-rounded btn btn-${
                diamondFilter ? "light" : "outline-secondary"
              }`}
            >
              <FontAwesomeIcon icon={faGem} /> Only Diamonds
            </button>
            {blockchainSettings
              .filter((chain) => chain.display === true && chain.hash)
              .map((chain, index) => {
                const chainData = getBlockchainData(chain.hash);
                return (
                  <button
                    key={index}
                    onClick={() => {
                      const aux = [...chainFilter];
                      if (chainFilter.includes(chain.hash!)) {
                        aux.splice(aux.indexOf(chain.hash!), 1);
                      } else {
                        aux.push(chain.hash!);
                      }
                      setChainFilter(aux);
                    }}
                    className={`col-xs-12 col-md-6 rair-rounded btn btn-${
                      chainFilter.includes(chain.hash!)
                        ? "light"
                        : "outline-secondary"
                    }`}
                  >
                    <img
                      alt={chain?.name}
                      src={chainData?.image}
                      style={{ maxHeight: "1.5rem", maxWidth: "1.5rem" }}
                      className="me-2"
                    />
                    <small>{chain.name}</small>
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
                titleSearch !== "" &&
                item.title &&
                !item.title.toLowerCase().includes(titleSearch.toLowerCase())
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
              const chainInformation = getBlockchainData(
                item.blockchain as `0x${string}`
              );
              return (
                <NavLink
                  to={`/creator/contract/${item.blockchain}/${item.contractAddress}/createCollection`}
                  key={index}
                  style={{
                    position: "relative",
                    backgroundColor: `color-mix(in srgb, ${primaryColor}, #888888)`,
                  }}
                  className={`col-12 btn btn-${primaryColor} text-start rounded-rair my-1`}
                >
                  {item?.blockchain && (
                    <abbr title={chainInformation?.name}>
                      <img
                        alt={chainInformation?.name}
                        src={chainInformation?.image}
                        style={{ maxHeight: "1.5rem", maxWidth: "1.5rem" }}
                        className="me-2"
                      />
                    </abbr>
                  )}
                  {item.diamond === true && (
                    <abbr title={"Diamond Contract"}>
                      <FontAwesomeIcon icon={faGem} className="me-2" />
                    </abbr>
                  )}
                  {item?.blockchain && chainInformation?.testnet && (
                    <abbr title={"Testnet Contract"}>
                      <FontAwesomeIcon icon={faVial} className="me-2" />
                    </abbr>
                  )}
                  {item.blockView && (
                    <abbr title={"Hidden"}>
                      <FontAwesomeIcon icon={faEyeSlash} className="me-2" />
                    </abbr>
                  )}
                  {item.blockSync && (
                    <abbr title={"Will not sync"}>
                      <FontAwesomeIcon icon={faLinkSlash} className="me-2" />
                    </abbr>
                  )}
                  {item.title}
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "10px",
                      color:
                        import.meta.env.VITE_TESTNET === "true"
                          ? `${iconColor === "#1486c5" ? "#F95631" : iconColor}`
                          : `${iconColor === "#1486c5" ? "#E882D5" : iconColor}`,
                    }}
                  />
                </NavLink>
              );
            })
        ) : (
          <div
            style={{
              border: `1.3px dashed color-mix(in srgb, ${primaryColor}, #888888)`,
            }}
            className="rounded-rair p-5"
          >
            <h5 className="mt-5">
              It seems, you have not deployed any contracts yet
            </h5>
            <NavLink
              to="/creator/deploy"
              style={{
                background: primaryButtonColor,
                color: textColor,
              }}
              className="btn rair-button mb-5 mt-3"
            >
              Deploy
            </NavLink>
          </div>
        )
      ) : (
        "Fetching data..."
      )}
      <hr />
    </NavigatorFactory>
  );
};

export default Contracts;
