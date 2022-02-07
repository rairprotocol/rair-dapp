import React from "react";
import cl from "./NftDifferentRarity.module.css";
import { useHistory } from "react-router-dom";
import CustomButton from "../../../../utils/button/CustomButton";

const NftDifferentRarity = ({
  blockchain,
  contract,
  product,
  productsFromOffer,
  selectedData,
  selectedToken,
}) => {
  // console.log(productsFromOffer.map((of) => of.offer[0]));
  const history = useHistory();

  const rarity = ["Ultra Rair", "Rair", "Common"];
  if (productsFromOffer === 0) {
    return (
      <div className={cl.mainWrapper}>
        <div className={cl.main}>
          <i style={{ color: `#E4476D` }} className={`fas fa-key ${cl.iconKey}`} />
          <span style={{ color: `#E4476D` }} className={cl.rarity}>{rarity[0]}</span>
        </div>
        <CustomButton
          text={rarity[0]}
          width={"224px"}
          height={"48px"}
          margin={"0"}
        />
      </div>
    );
  } else if (productsFromOffer === 1) {
    return (
      <div className={cl.mainWrapper}>
        <div className={cl.main}>
          <i style={{ color: `gold` }} className={`fas fa-key ${cl.iconKey}`} />
          <span style={{ color: `gold` }} className={cl.rarity}>{rarity[1]}</span>
        </div>
        <CustomButton
          text={rarity[1]}
          width={"224px"}
          height={"48px"}
          margin={"0"}
        />
      </div>
    );
  } else {
    return (
      <div className={cl.mainWrapper}>
        <div className={cl.main}>
          <i style={{ color: `silver` }} className={`fas fa-key ${cl.iconKey}`} />
          <span  style={{ color: `silver` }} className={cl.rarity}>{rarity[2]}</span>
        </div>
        <CustomButton
          text={rarity[2]}
          width={"224px"}
          height={"48px"}
          margin={"0"}
        />
      </div>
    );
  }
};

export default NftDifferentRarity;
