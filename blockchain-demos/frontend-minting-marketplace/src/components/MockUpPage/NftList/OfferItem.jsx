import React from "react";

export default function OfferItem({ index, metadata, setSelected }) {
  return (
    <button style={{
      border: 'none',
      background: 'none',
      marginTop: '1rem',
    }} key={index} onClick={() => setSelected(metadata)}>
      <img
        style={{ width: "291px", height: "291px", margin: '1rem 1rem' }}
        src={metadata.image}
        alt={metadata}
      />
    </button>
  );
}
