import React from "react";
import cl from "./NftDifferentRarity.module.css";
import CustomButton from "../../../../utils/button/CustomButton";

const NftDifferentRarity = ({ title }) => {
  const colorRarity = title === "Ultra Rair" ? `#E4476D` : title === "Rair" ? "gold" : "silver";

  return (
    <div className={cl.mainWrapper}>
      <div className={cl.main}>
        <i style={{ color: colorRarity }} className={`fas fa-key ${cl.iconKey}`} />
        <span style={{ color: colorRarity }} className={cl.rarity}>{title}</span>
      </div>
      <CustomButton
        text={title}
        width={"224px"}
        height={"48px"}
        margin={"0"}
      />
    </div>
  )
}

export default NftDifferentRarity;
