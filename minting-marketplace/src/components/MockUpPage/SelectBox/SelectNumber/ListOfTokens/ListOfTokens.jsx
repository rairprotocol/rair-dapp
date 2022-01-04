import React, { useRef, memo, useCallback, useState } from "react";
import { useEffect } from "react";
import { CurrentTokens } from "../CurrentTokens/CurrentTokens";
import "../../styles.css";

const ListOfTokensComponent = ({
  blockchain,
  contract,
  isOpen,
  handleIsOpen,
  numberRef,
  onClickItem,
  product,
  primaryColor,
  setSelectedToken,
  selectedToken,
  selectedItem,
  setIsOpen,
  totalCount,
}) => {
  const [tokenData, setTokenData] = useState([]);
  const [elem, setElem] = useState([]);
  const rootRef = useRef();
  const appRef = useRef();
  const limit = 100;
  const [isOpens, setIsOpens] = useState(false);
  const [isBack /*setIsBack*/] = useState(true);

  const getNumberFromStr = (str) => {
    const newStr = str.replace(" -", "");
    const first = newStr.slice(0, newStr.indexOf(" "));
    const second = newStr.slice(newStr.indexOf(" ") + 1);
    return [first, second];
  };

  const getPaginationData = useCallback(
    async (target) => {
      console.log(target.innerText);
      const indexes = getNumberFromStr(target.innerText);
      const responseAllProduct = await (
        await fetch(
          //   `/api/nft/${contract}/${product}?fromToken=${indexes[0]}&limit=${indexes[1]}`,
          `/api/nft/network/${blockchain}//${contract}/${product}?fromToken=${indexes[0]}&limit=${limit}`,
          {
            method: "GET",
          }
        )
      ).json();

      setTokenData(responseAllProduct.result.tokens);
      setSelectedToken(indexes[0]);
    },
    [blockchain, contract, product, setSelectedToken]
  );

  const getPaginationToken = useCallback(
    (e) => {
      getPaginationData(e.target);
      setIsOpens(true);
    },
    [getPaginationData, setIsOpens]
  );

  useEffect(() => {
    if (totalCount) {
      const number = totalCount;

      const buildDivs = (number) => {
        // const root = rootRef.current;
        const divCount = parseInt(number / 100 + "") + 1;

        // Array(divCount)
        //   .fill(0)
        //   .forEach((_, i) => {
        //     const div = document.createElement("div");
        //     div.classList.add("serial-box");
        //     div.classList.add("serial-numb");
        //     div.addEventListener("click", getPaginationToken, false);
        //     div.innerText = `${i++ * 10 } - ${(i++) * 10 - 1}`;
        //     root.appendChild(div);
        //   });
        const ddd = Array(divCount).fill(0);
        setElem(ddd);
      };

      buildDivs(number);
    }
  }, [setElem, totalCount, getPaginationToken]);

  return !isOpens ? (
    <div ref={numberRef} className="select-box--box">
      <div className="select-box--container">
        <div ref={appRef} className="select-box--selected-item">
          Choose Range
        </div>
        <div className="select-box--arrow"></div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            alignContent: "center",
            width: "25rem",
            padding: "10px 0",
            // background: "#383637",
            background: `${
              primaryColor === "rhyno" ? "var(--rhyno)" : "#383637"
            }`,
            borderRadius: "16px",
            border: "1px solid #D37AD6",
          }}
          id="rred"
          className={"select-box--items"}
          ref={rootRef}
        >
          {elem.map((_, i) => {
            return (
              <div
                key={i + _}
                onClick={(e) => getPaginationToken(e)}
                className="serial-box serial-numb llll"
                style={{
                  // border: "1px solid #D37AD6",
                  background: "grey",
                }}
              >
                {`${i++ * 100} - ${i++ * 100 - 1}`}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ) : (
    <CurrentTokens
      primaryColor={primaryColor}
      items={tokenData}
      isOpen={isOpen}
      isBack={isBack}
      selectedToken={selectedToken}
      selectedItem={selectedItem}
      setIsOpen={setIsOpen}
      setIsOpens={setIsOpens}
      numberRef={numberRef}
      handleIsOpen={handleIsOpen}
      onClickItem={onClickItem}
    />
  );
};

export const ListOfTokens = memo(ListOfTokensComponent);
