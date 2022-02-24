import React from "react";

import cl from "./CustomButton.module.css";

function CustomButton({
  text,
  width,
  height,
  onClick,
  textColor,
  margin,
//   primaryColor,
}) {
  return (
    <div
      style={{
        width: width,
        height: height,
        color: textColor,
        margin: margin,
      }}
      className={cl.nftDataPageShowMoreWrapper}
    >
      {onClick ? (
        <div
          onClick={() => onClick()}
          style={{
            width: width,
            height: height,
            color: textColor,
            // background: `${primaryColor === "rhyno" ? "var(--rhyno)" : "red"
            //                      }`,
          }}
          className={cl.nftDataPageShowMore}
        >
          <span className={cl.nftDataPageShowMoreText}>{text}</span>
        </div>
      ) : (
        <div
          style={{
            width: width,
            height: height,
            color: textColor,
            // background: `${primaryColor === "rhyno" ? "var(--rhyno)" : "#383637"
            //                      }`,
          }}
          className={cl.nftDataPageShowMore}
        >
          <span className={cl.nftDataPageShowMoreText}>{text}</span>
        </div>
      )}
    </div>
  );
}

export default CustomButton;
