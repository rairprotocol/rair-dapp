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
  const history = useHistory();
  const rarity = {
    ultra: "Ultra Rair",
    rair: "Rair",
    common: "Common",
  };
  return (
    <div className={cl.mainWrapper}>
      <div className={cl.main}>
        <i style={{ color: `red` }} className={`fas fa-key ${cl.iconKey}`} />
        <span className={cl.rarity}>{rarity.ultra}</span>
      {/* <CustomButton style={{margin: 'inherit'}} text={rarity.ultra} width={"224px"} height={"48px"} /> */}

      </div>
    </div>
  );
};

export default NftDifferentRarity;
