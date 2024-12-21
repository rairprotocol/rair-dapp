import { useCallback, useState } from "react";
import {
  faEye,
  faEyeSlash,
  faGem,
  faLink,
  faLinkSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

import { useAppSelector } from "../../hooks/useReduxHooks";
import useServerSettings from "../../hooks/useServerSettings";
import InputField from "../common/InputField";

const ContractManager = ({ contractList, getContractList }) => {
  const [textFilter, setTextFilter] = useState<string>("");

  const { getBlockchainData } = useServerSettings();
  const { primaryButtonColor, textColor, secondaryButtonColor, primaryColor } =
    useAppSelector((store) => store.colors);

  const updateContractData = useCallback(
    async (id: string, setting: string, value: boolean) => {
      await axios.patch(
        `/api/contracts/${id}`,
        {
          [setting]: value,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      getContractList();
    },
    [getContractList]
  );

  return (
    <div className="col-12 row">
      <div className="col-12">
        <InputField
          label="Text Filter"
          getter={textFilter}
          setter={setTextFilter}
          customClass="rounded-rair form-control"
        />
      </div>
      <div
        style={{
          overflowY: "scroll",
          maxHeight: "60vh",
        }}
      >
        <table
          className="table-hover col-12 table-striped table-responsive"
          style={{
            color: textColor,
            backgroundColor: primaryColor,
          }}
        >
          <thead>
            <tr>
              <th>Contract</th>
              <th className="align-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contractList
              .filter(
                ({ title, contractAddress }) =>
                  title?.includes(textFilter) ||
                  contractAddress.includes(textFilter)
              )
              .map(
                (
                  {
                    title,
                    diamond,
                    contractAddress,
                    _id,
                    blockchain,
                    blockView,
                    blockSync,
                  },
                  index
                ) => {
                  const chainData = getBlockchainData(blockchain);
                  return (
                    <tr key={index}>
                      <th>
                        {diamond && <FontAwesomeIcon icon={faGem} />}{" "}
                        <abbr title={contractAddress}>{title}</abbr> (
                        {chainData?.symbol})
                      </th>
                      <th>
                        <button
                          onClick={() =>
                            updateContractData(_id, "blockView", !blockView)
                          }
                          className="rair-button btn col-12 col-md-6"
                          style={{
                            color: textColor,
                            background: secondaryButtonColor,
                          }}
                        >
                          {" "}
                          <FontAwesomeIcon
                            icon={blockView ? faEyeSlash : faEye}
                          />
                          {blockView ? "Hidden" : "Visible"}{" "}
                        </button>
                        <button
                          onClick={() =>
                            updateContractData(_id, "blockSync", !blockSync)
                          }
                          className="rair-button btn col-12 col-md-6"
                          style={{
                            color: textColor,
                            background: primaryButtonColor,
                          }}
                        >
                          {" "}
                          <FontAwesomeIcon
                            icon={blockSync ? faLinkSlash : faLink}
                          />
                          {blockSync ? "Won't" : "Will"} sync{" "}
                        </button>
                      </th>
                    </tr>
                  );
                }
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractManager;
