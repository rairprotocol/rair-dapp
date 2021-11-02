import React from "react";

export default function OfferItem({
  handleClickToken,
  token,
  index,
  metadata,
  setSelectedToken,
}) {
  console.log(metadata)
  const select = () => {

    setSelectedToken(token)
    handleClickToken(token)
    console.log(metadata?.image, 'metadata?.image');
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
        src={metadata.image ? metadata.image : "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW"}
        alt={metadata}
      />
    </button>
  );
}