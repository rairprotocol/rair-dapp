//@ts-nocheck
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "../../../hooks/useReduxHooks";
import { defaultAvatar } from "../../../images/index";
import { rFetch } from "../../../utils/rFetch";
import { rairSDK } from "../../common/rairSDK";

const LeaderBoard = ({ titleColumn, userpage, tableData }) => {
  const navigate = useNavigate();

  const navigateToProfilePage = (userAddress) => {
    navigate(`/${userAddress}`);
  };

  return (
    <div className={`table-container-leader ${userpage && "userpage"}`}>
      <table>
        <thead>
          <tr>
            {titleColumn.map((el, index) => {
              return (
                <th key={index} className={el.class}>
                  {el.name}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {tableData &&
            tableData.length > 0 &&
            tableData.map((el, index) => {
              return (
                <tr key={index}>
                  <td
                    onClick={() => navigateToProfilePage(el.publicAddress)}
                    className="git-handle"
                  >
                    <img src={defaultAvatar} alt="Avatar" className="avatar" />{" "}
                    {el.firstRow
                      ? el.firstRow.length > 12
                        ? `${el.firstRow?.slice(
                            0,
                            9
                          )}...${el.firstRow?.slice(length - 5)}`
                        : el.firstRow
                      : el.nickName && el.nickName.length > 12
                        ? `${el.nickName?.slice(
                            0,
                            9
                          )}...${el.nickName?.slice(length - 5)}`
                        : el.nickName}
                  </td>
                  <td>{el.secondRow ? el.secondRow : "104"}</td>
                  <td className="availability-number">
                    {el.thirdRow ? el.thirdRow : "Open"}
                  </td>
                  <td className="language-text">
                    {el.fourthRow ? (
                      <>
                        <span className="icon"></span> {el.fourthRow}
                      </>
                    ) : (
                      "Solidity"
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderBoard;
