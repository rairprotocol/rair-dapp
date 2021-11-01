import React from "react";

export default function OfferItem({
  handleClickToken,
  token,
  index,
  metadata,
  setSelectedToken,
}) {
  const select = () => {

    setSelectedToken(token)
    handleClickToken(token)
  }
  return (
    <button
      style={{
        border: "none",
        background: "none",
        marginTop: "1rem",
      }}
      key={index}
      onClick={() => {
        select(token);
        // handleClickToken(token)
        //  setSelected(metadata)}
      }}
    >
      <img
        style={{
          width: "291px",
          height: "291px",
          margin: "1rem 1rem",
          pointerEvents: "none",
        }}
        src={metadata?.image}
        alt={metadata}
      />
    </button>
  );
}
